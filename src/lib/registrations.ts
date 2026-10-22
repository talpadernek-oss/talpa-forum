import 'server-only';
import crypto from 'crypto';
import { readJson, writeJson, deleteKey, readAllJson } from './store';
import type { Registration } from './constants';
import type { RegistrationFields } from './validation';

/**
 * One JSON document per registration (`registrations/<id>.json`) plus an
 * e-mail index (`email-index/<hash>.json`) so duplicate checks don't have to
 * read every registration.
 */

const regKey = (id: string) => `registrations/${id}.json`;
const emailKey = (email: string) =>
  `email-index/${crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 40)}.json`;

export class DuplicateEmailError extends Error {
  constructor(public existingId: string) {
    super('Bu e-posta adresiyle daha önce kayıt yapılmış.');
  }
}

async function findIdByEmail(email: string): Promise<string | null> {
  if (!email) return null;
  const entry = await readJson<{ id: string }>(emailKey(email));
  if (!entry) return null;
  // Ignore stale index entries (e.g. after a manual delete in the storage console).
  const reg = await readJson<Registration>(regKey(entry.id));
  return reg && reg.email === email ? entry.id : null;
}

export async function listRegistrations(): Promise<Registration[]> {
  const all = await readAllJson<Registration>('registrations/');
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const getRegistration = (id: string) =>
  /^[a-z0-9-]{8,40}$/.test(id) ? readJson<Registration>(regKey(id)) : Promise.resolve(null);

export async function createRegistration(fields: RegistrationFields, source: Registration['source']) {
  const existing = await findIdByEmail(fields.email);
  if (existing) throw new DuplicateEmailError(existing);

  const now = new Date().toISOString();
  const reg: Registration = { id: crypto.randomUUID(), ...fields, source, createdAt: now, updatedAt: now };
  await writeJson(regKey(reg.id), reg);
  if (reg.email) await writeJson(emailKey(reg.email), { id: reg.id });
  return reg;
}

export async function updateRegistration(id: string, fields: Partial<RegistrationFields>) {
  const current = await getRegistration(id);
  if (!current) return null;

  const emailChanged = fields.email !== undefined && fields.email !== current.email;
  if (emailChanged && fields.email) {
    const other = await findIdByEmail(fields.email);
    if (other && other !== id) throw new DuplicateEmailError(other);
  }

  const next: Registration = { ...current, ...fields, updatedAt: new Date().toISOString() };
  await writeJson(regKey(id), next);
  if (emailChanged) {
    if (current.email) await deleteKey(emailKey(current.email));
    if (next.email) await writeJson(emailKey(next.email), { id });
  }
  return next;
}

export async function deleteRegistration(id: string) {
  const current = await getRegistration(id);
  if (!current) return false;
  await deleteKey(regKey(id));
  if (current.email) await deleteKey(emailKey(current.email));
  return true;
}
