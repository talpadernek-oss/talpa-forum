import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { validateRegistration } from '@/lib/validation';
import { createRegistration, DuplicateEmailError } from '@/lib/registrations';
import { isValidTCKN } from '@/lib/tckn';
import { findMemberByTc } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await readBody(req);

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (body?.website) return ok({ name: '' });
  if (body?.consent !== true) return fail('Devam etmek için aydınlatma metnini onaylayınız.');

  // TALPA members: name comes from Odoo; e-mail / phone left empty mean "use the Odoo value".
  let memberPartnerId: number | undefined;
  if (body?.tcNo) {
    const tc = typeof body.tcNo === 'string' ? body.tcNo.trim() : '';
    if (!isValidTCKN(tc)) return fail('Geçerli bir T.C. Kimlik Numarası giriniz.');
    const lookup = await findMemberByTc(tc);
    if (lookup.kind === 'error') return fail(lookup.error, 503);
    if (lookup.kind === 'not_member') return fail('Bu T.C. Kimlik Numarası ile aktif bir TALPA üyeliği bulunamadı.');
    const m = lookup.member;
    memberPartnerId = m.partnerId;
    body.fullName = m.fullName || body.fullName;
    body.email = body.email || m.email;
    body.phone = body.phone || m.phone;
    body.organization = body.organization || m.organization;
  }

  const result = validateRegistration(body, 'public');
  if (!result.ok) return fail(result.error);

  try {
    const reg = await createRegistration(
      { ...result.data, ...(memberPartnerId ? { talpaMember: true, odooPartnerId: memberPartnerId } : {}) },
      'form'
    );
    return ok({ name: reg.fullName });
  } catch (e) {
    if (e instanceof DuplicateEmailError)
      return fail('Bu e-posta adresiyle kaydınız zaten alınmış. Değişiklik için bizimle iletişime geçebilirsiniz.', 409);
    console.error('register failed', e);
    return fail('Kayıt şu anda alınamadı. Lütfen biraz sonra tekrar deneyiniz.', 500);
  }
}
