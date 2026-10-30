import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { isValidTCKN } from '@/lib/tckn';
import { findMemberByTc, maskEmail, maskName, maskPhone } from '@/lib/odoo';
import { rateLimited } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

/**
 * Returns only masked contact details. The real values never leave the
 * server: /api/register looks the member up again and fills them in.
 */
export async function POST(req: NextRequest) {
  // Same bucket as the TC lookup in /api/register, so that route can't be used to get around it.
  if (rateLimited('member-lookup', req)) return fail('Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyiniz.', 429);

  const { tcNo } = await readBody<{ tcNo?: string }>(req);
  const tc = typeof tcNo === 'string' ? tcNo.trim() : '';
  if (!isValidTCKN(tc)) return fail('Geçerli bir T.C. Kimlik Numarası giriniz.');

  const result = await findMemberByTc(tc);
  if (result.kind === 'error') return fail(result.error, 503);
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
