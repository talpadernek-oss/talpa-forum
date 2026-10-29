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
  orgFields: csv(env('ODOO_ORGANIZATION_FIELDS', '')),
  // Contact details kept in their own model (one row per e-mail / phone, linked to the member).
  email: linked('EMAIL'),
  phone: linked('PHONE')
});

/** ODOO_PHONE_MODEL / ODOO_PHONE_LINK_FIELD / ODOO_PHONE_ORDER (same for EMAIL). */
const linked = (kind: 'EMAIL' | 'PHONE') => ({
  model: env(`ODOO_${kind}_MODEL`),
  linkField: env(`ODOO_${kind}_LINK_FIELD`),
  order: env(`ODOO_${kind}_ORDER`, 'id')
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

type FieldInfo = Record<string, { type: string; relation?: string }>;
type Session = { url: string; db: string; uid: number; apiKey: string };

const call = <T>(s: Session, model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) =>
  rpc<T>(s.url, 'object', 'execute_kw', [s.db, s.uid, s.apiKey, model, method, args, kwargs]);

const fieldsOf = (s: Session, model: string) => call<FieldInfo>(s, model, 'fields_get', [], { attributes: ['type', 'relation'] });

/** Drops configured fields the model doesn't have, so one wrong name doesn't break the lookup. */
function keepExisting(fields: string[], info: FieldInfo, model: string) {
  const missing = fields.filter(f => !info[f]);
  if (missing.length) console.warn(`Odoo: ${model} has no field(s) ${missing.join(', ')}; check ODOO_*_FIELDS`);
  return fields.filter(f => info[f]);
}

/** First value of `fields` on the linked contact model, e.g. the member's phone row. */
async function readLinked(
  s: Session,
  memberModel: string,
  memberId: number,
  link: { model: string; linkField: string; order: string },
  fields: string[]
): Promise<string> {
  if (!link.model) return '';
  try {
    const info = await fieldsOf(s, link.model);
    const linkField =
      link.linkField || Object.keys(info).find(f => info[f].type === 'many2one' && info[f].relation === memberModel);
    if (!linkField) {
      console.error(`Odoo: no many2one to ${memberModel} on ${link.model}; set ODOO_*_LINK_FIELD`);
      return '';
    }
    const read = keepExisting(fields, info, link.model);
    if (!read.length) return '';
    const rows = await call<Record<string, unknown>[]>(s, link.model, 'search_read', [[[linkField, '=', memberId]]], {
      fields: read,
      order: link.order,
      limit: 1
    });
    return rows[0] ? first(rows[0], read) : '';
  } catch (e) {
    // Contact details are optional: the member can still type them in.
    console.error(`Odoo: reading ${link.model} failed`, e);
    return '';
  }
}

export async function findMemberByTc(tc: string): Promise<MemberLookup> {
  const c = config();
  if (!odooConfigured()) {
    const missing = ['ODOO_URL', 'ODOO_DB', 'ODOO_USERNAME', 'ODOO_API_KEY'].filter(k => !env(k));
    console.error('Odoo is not configured; missing', missing.join(', '));
    return { kind: 'error', error: 'Üyelik doğrulama şu anda kullanılamıyor.' };
  }

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

    const s: Session = { url: c.url, db: c.db, uid, apiKey: c.apiKey };
    const info = await fieldsOf(s, c.model);
    if (!info[c.tcField]) {
      console.error(`Odoo: ${c.model} has no field ${c.tcField}; check ODOO_TC_FIELD`);
      return { kind: 'error', error: 'Üyelik doğrulama şu anda kullanılamıyor.' };
    }
    // E-mail / phone fields belong to the linked model when one is configured.
    const ownFields = [...c.nameFields, ...c.orgFields, ...(c.email.model ? [] : c.emailFields), ...(c.phone.model ? [] : c.phoneFields)];
    const fields = keepExisting(Array.from(new Set(ownFields)), info, c.model);

    const rows = await call<Record<string, unknown>[]>(s, c.model, 'search_read', [[[c.tcField, '=', tc.trim()], ...extraDomain]], {
      fields,
      limit: 1
    });

    const row = rows[0];
    if (!row) return { kind: 'not_member' };
    const id = Number(row.id);
    const [email, phone] = await Promise.all([
      c.email.model ? readLinked(s, c.model, id, c.email, c.emailFields) : first(row, c.emailFields),
      c.phone.model ? readLinked(s, c.model, id, c.phone, c.phoneFields) : first(row, c.phoneFields)
    ]);
    return {
      kind: 'member',
      member: {
        partnerId: id,
        fullName: titleCase(first(row, c.nameFields)),
        email: email.toLowerCase(),
        phone,
        organization: first(row, c.orgFields)
      }
    };
  } catch (e) {
    console.error('Odoo member lookup failed', e);
    return { kind: 'error', error: 'Üyelik sistemine şu anda ulaşılamıyor. Lütfen biraz sonra tekrar deneyiniz.' };
  }
}

/* ---------- Masking: the verify endpoint is public and a TC number is not a secret ---------- */

const stars = (n: number) => '*'.repeat(Math.max(n, 0));

/** "burhanfatihmermer@gmail.com" -> "bu*************er@gmail.com" */
export const maskEmail = (email: string) => {
  const at = email.lastIndexOf('@');
  if (at < 1) return '';
  const local = Array.from(email.slice(0, at));
  const domain = email.slice(at);
  // Too short to show both ends without revealing the whole name.
  if (local.length <= 4) return local[0] + stars(local.length - 1) + domain;
  return local.slice(0, 2).join('') + stars(local.length - 4) + local.slice(-2).join('') + domain;
};

/** "+905321232676" -> "******26 76" */
export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length < 4 ? '' : `******${digits.slice(-4, -2)} ${digits.slice(-2)}`;
};

/** "Burhan Fatih Mermer" -> "Bu**** Fa*** Me****" */
export const maskName = (name: string) =>
  name
    .split(' ')
    .map(word => {
      const chars = Array.from(word);
      return chars.slice(0, 2).join('') + stars(chars.length - 2);
    })
    .join(' ');
