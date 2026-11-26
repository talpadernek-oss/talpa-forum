import { DAYS, JOB_SEEKER_TITLE, ROLES, type DayValue, type RoleValue } from './constants';
import { msg, type Lang, type MessageKey } from './messages';

export interface RegistrationFields {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  organization: string;
  days: DayValue[];
  role: RoleValue;
  notes: string;
  checkedIn: boolean;
}

type Result = { ok: true; data: RegistrationFields } | { ok: false; error: string };

const clean = (v: unknown, max = 120) =>
  (typeof v === 'string' ? v : '').replace(/\s+/g, ' ').trim().slice(0, max);

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

/** Keeps a leading "+" and digits only. */
export const normalizePhone = (phone: string) => {
  const t = phone.trim();
  return (t.startsWith('+') ? '+' : '') + t.replace(/\D/g, '');
};

export const isValidPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * `public`: the website form – every field is required, role is always "katılımcı".
 * `admin`: manual entry / edit – only the name is required (protocol guests may have no e-mail).
 */
export function validateRegistration(input: any, mode: 'public' | 'admin', lang: Lang = 'tr'): Result {
  const fail = (key: MessageKey): Result => ({ ok: false, error: msg(key, lang) });
  const fullName = clean(input?.fullName);
  const email = clean(input?.email).toLowerCase();
  const phone = normalizePhone(clean(input?.phone, 30));
  const jobTitle = clean(input?.jobTitle);
  const organization = clean(input?.organization, 160);
  const notes = mode === 'admin' ? (typeof input?.notes === 'string' ? input.notes.trim().slice(0, 1000) : '') : '';
  const days = (Array.isArray(input?.days) ? input.days : []).filter((d: unknown): d is DayValue =>
    DAYS.some(x => x.value === d)
  );
  const role: RoleValue =
    mode === 'admin' && ROLES.some(r => r.value === input?.role) ? input.role : 'katilimci';

  if (fullName.length < 3) return fail('nameRequired');
  if (mode === 'public' && !fullName.includes(' ')) return fail('nameBoth');

  if (mode === 'public' || email) {
    if (!isValidEmail(email)) return fail('emailInvalid');
  }
  if (mode === 'public' || phone) {
    if (!isValidPhone(phone)) return fail('phoneInvalid');
  }
  if (mode === 'public') {
    if (!jobTitle) return fail('jobTitleRequired');
    if (!organization && jobTitle !== JOB_SEEKER_TITLE) return fail('organizationRequired');
    if (!days.length) return fail('daysRequired');
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      jobTitle,
      organization,
      days: DAYS.map(d => d.value).filter(d => days.includes(d)),
      role,
      notes,
      checkedIn: mode === 'admin' && input?.checkedIn === true
    }
  };
}
