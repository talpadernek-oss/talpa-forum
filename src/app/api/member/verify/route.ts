import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { isValidTCKN } from '@/lib/tckn';
import { findMemberByTc, maskEmail, maskName, maskPhone } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

// Best-effort per-instance limit; slows down TC enumeration without extra infrastructure.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Returns only masked contact details. The real values never leave the
 * server: /api/register looks the member up again and fills them in.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (limited(ip)) return fail('Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyiniz.', 429);

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
