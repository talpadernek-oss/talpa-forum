import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { isValidTCKN } from '@/lib/tckn';
import { findMemberByTc, maskEmail, maskName, maskPhone } from '@/lib/odoo';
import { rateLimited } from '@/lib/rateLimit';
import { langOf, msg } from '@/lib/messages';

export const dynamic = 'force-dynamic';

/**
 * Returns only masked contact details. The real values never leave the
 * server: /api/register looks the member up again and fills them in.
 */
export async function POST(req: NextRequest) {
  const { tcNo, lang: rawLang } = await readBody<{ tcNo?: string; lang?: string }>(req);
  const lang = langOf(rawLang);

  // Same bucket as the TC lookup in /api/register, so that route can't be used to get around it.
  if (rateLimited('member-lookup', req)) return fail(msg('tooManyAttempts', lang), 429);

  const tc = typeof tcNo === 'string' ? tcNo.trim() : '';
  if (!isValidTCKN(tc)) return fail(msg('tcInvalid', lang));

  const result = await findMemberByTc(tc);
  if (result.kind === 'error') return fail(msg(result.error, lang), 503);
  if (result.kind === 'not_member') return ok({ isMember: false });

  const m = result.member;
  return ok({
    isMember: true,
    member: {
      name: maskName(m.fullName),
      email: m.email ? maskEmail(m.email) : '',
      phone: m.phone ? maskPhone(m.phone) : '',
      organization: m.organization
    }
  });
}
