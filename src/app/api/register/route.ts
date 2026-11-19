import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { validateRegistration } from '@/lib/validation';
import { createRegistration, DuplicateEmailError, DuplicateMemberError } from '@/lib/registrations';
import { isValidTCKN } from '@/lib/tckn';
import { findMemberByTc } from '@/lib/odoo';
import { rateLimited } from '@/lib/rateLimit';
import { sendRegistrationConfirmation } from '@/lib/mailer';
import { langOf, msg } from '@/lib/messages';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await readBody(req);
  // Language of the page the form was sent from: error messages and the confirmation e-mail follow it.
  const lang = langOf(body?.lang);

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (body?.website) return ok({ name: '' });
  if (body?.consent !== true) return fail(msg('consentRequired', lang));

  // TALPA members: name comes from Odoo; e-mail / phone left empty mean "use the Odoo value".
  let memberPartnerId: number | undefined;
  let odooEmail = '';
  if (body?.tcNo) {
    if (rateLimited('member-lookup', req)) return fail(msg('tooManyAttempts', lang), 429);
    const tc = typeof body.tcNo === 'string' ? body.tcNo.trim() : '';
    if (!isValidTCKN(tc)) return fail(msg('tcInvalid', lang));
    const lookup = await findMemberByTc(tc);
    if (lookup.kind === 'error') return fail(msg(lookup.error, lang), 503);
    if (lookup.kind === 'not_member') return fail(msg('notMember', lang));
    const m = lookup.member;
    memberPartnerId = m.partnerId;
    odooEmail = m.email;
    body.fullName = m.fullName || body.fullName;
    body.email = body.email || m.email;
    body.phone = body.phone || m.phone;
    body.organization = body.organization || m.organization;
  }

  const result = validateRegistration(body, 'public', lang);
  if (!result.ok) return fail(result.error);

  try {
    const reg = await createRegistration(
      { ...result.data, lang, ...(memberPartnerId ? { talpaMember: true, odooPartnerId: memberPartnerId } : {}) },
      'form'
    );
    // A member's Odoo name only goes to the member's own Odoo address; anyone can type a TC number
    // with their own e-mail, and the name must stay masked for them (see /api/member/verify).
    const mailName = !memberPartnerId || (odooEmail && reg.email === odooEmail) ? reg.fullName : '';
    // Awaited: on Vercel the function may be frozen once the response is sent.
    await sendRegistrationConfirmation(reg.email, mailName, lang);
    // A member's name comes from Odoo; echoing it back would undo the masking of /api/member/verify.
    return ok({ name: memberPartnerId ? '' : reg.fullName });
  } catch (e) {
    if (e instanceof DuplicateEmailError) return fail(msg('duplicateEmail', lang), 409);
    if (e instanceof DuplicateMemberError) return fail(msg('duplicateMember', lang), 409);
    console.error('register failed', e);
    return fail(msg('registerFailed', lang), 500);
  }
}
