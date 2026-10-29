import 'server-only';

/**
 * TALPA member lookup in Odoo over JSON-RPC (`/jsonrpc`, API key as password).
 * Model and field names come from env so they can match the member tables
 * without a code change; see .env.example.
 */

export interface OdooMember {
  partnerId: number;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
}

export type MemberLookup =
  | { kind: 'member'; member: OdooMember }
  | { kind: 'not_member' }
  | { kind: 'error'; error: string };

const env = (key: string, fallback = '') => (process.env[key] || fallback).trim();
const csv = (v: string) => v.split(',').map(s => s.trim()).filter(Boolean);

const config = () => ({
  url: env('ODOO_URL').replace(/\/+$/, ''),
  db: env('ODOO_DB'),
  login: env('ODOO_USERNAME'),
  apiKey: env('ODOO_API_KEY'),
  model: env('ODOO_MEMBER_MODEL', 'res.partner'),
  tcField: env('ODOO_TC_FIELD', 'x_tc_kimlik_no'),
  memberDomain: env('ODOO_MEMBER_DOMAIN', '[]'),
  nameFields: csv(env('ODOO_NAME_FIELDS', 'name')),
  emailFields: csv(env('ODOO_EMAIL_FIELDS', 'email')),
  phoneFields: csv(env('ODOO_PHONE_FIELDS', 'mobile,phone')),
  orgFields: csv(env('ODOO_ORGANIZATION_FIELDS', ''))
});

export const odooConfigured = () => {
  const c = config();
  return Boolean(c.url && c.db && c.login && c.apiKey);
};

async function rpc<T>(url: string, service: string, method: string, args: unknown[]): Promise<T> {
  const res = await fetch(`${url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { service, method, args }, id: Date.now() }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`Odoo HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.data?.message || json.error.message || 'Odoo RPC error');
  return json.result as T;
}

/** many2one fields come back as [id, "Display name"]; empty fields as false. */
const text = (v: unknown): string =>
  Array.isArray(v) ? text(v[1]) : typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';

const first = (row: Record<string, unknown>, fields: string[]) => {
  for (const f of fields) {
    const v = text(row[f]);
    if (v) return v;
  }
  return '';
};

/** "AHMET  yılmaz" -> "Ahmet Yılmaz" */
const titleCase = (name: string) =>
  name
    .split(' ')
    .map(w => w.split('-').map(p => p.charAt(0).toLocaleUpperCase('tr-TR') + p.slice(1).toLocaleLowerCase('tr-TR')).join('-'))
    .join(' ');

export async function findMemberByTc(tc: string): Promise<MemberLookup> {
  const c = config();
  if (!odooConfigured()) return { kind: 'error', error: 'Üyelik doğrulama şu anda kullanılamıyor.' };

  let extraDomain: unknown[];
  try {
    extraDomain = JSON.parse(c.memberDomain);
    if (!Array.isArray(extraDomain)) throw new Error();
  } catch {
    console.error('ODOO_MEMBER_DOMAIN is not a JSON array');
    return { kind: 'error', error: 'Üyelik doğrulama şu anda kullanılamıyor.' };
  }

  try {
    const uid = await rpc<number | false>(c.url, 'common', 'authenticate', [c.db, c.login, c.apiKey, {}]);
    if (!uid) {
      console.error('Odoo authentication failed for', c.login);
      return { kind: 'error', error: 'Üyelik doğrulama şu anda kullanılamıyor.' };
    }

    const fields = Array.from(new Set([...c.nameFields, ...c.emailFields, ...c.phoneFields, ...c.orgFields]));
    const rows = await rpc<Record<string, unknown>[]>(c.url, 'object', 'execute_kw', [
      c.db,
      uid,
      c.apiKey,
      c.model,
      'search_read',
      [[[c.tcField, '=', tc.trim()], ...extraDomain]],
      { fields, limit: 1 }
    ]);

    const row = rows[0];
    if (!row) return { kind: 'not_member' };
    return {
      kind: 'member',
      member: {
        partnerId: Number(row.id),
        fullName: titleCase(first(row, c.nameFields)),
        email: first(row, c.emailFields).toLowerCase(),
        phone: first(row, c.phoneFields),
        organization: first(row, c.orgFields)
      }
    };
  } catch (e) {
    console.error('Odoo member lookup failed', e);
    return { kind: 'error', error: 'Üyelik sistemine şu anda ulaşılamıyor. Lütfen biraz sonra tekrar deneyiniz.' };
  }
}

/* ---------- Masking: the verify endpoint is public and a TC number is not a secret ---------- */

export const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return '';
  return `${local.slice(0, Math.min(2, local.length - 1))}***@${domain}`;
};

export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length < 4 ? '' : `*** *** ** ${digits.slice(-2)}`;
};

/** "Ahmet Can Yılmaz" -> "Ahmet Can Y." */
export const maskName = (name: string) => {
  const parts = name.split(' ');
  return parts.length < 2 ? name : `${parts.slice(0, -1).join(' ')} ${parts[parts.length - 1].charAt(0)}.`;
};
