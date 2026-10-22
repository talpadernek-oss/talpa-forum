import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { validateRegistration } from '@/lib/validation';
import { createRegistration, DuplicateEmailError } from '@/lib/registrations';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await readBody(req);

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (body?.website) return ok({ name: '' });
  if (body?.consent !== true) return fail('Devam etmek için aydınlatma metnini onaylayınız.');

  const result = validateRegistration(body, 'public');
  if (!result.ok) return fail(result.error);

  try {
    const reg = await createRegistration(result.data, 'form');
    return ok({ name: reg.fullName });
  } catch (e) {
    if (e instanceof DuplicateEmailError)
      return fail('Bu e-posta adresiyle kaydınız zaten alınmış. Değişiklik için bizimle iletişime geçebilirsiniz.', 409);
    console.error('register failed', e);
    return fail('Kayıt şu anda alınamadı. Lütfen biraz sonra tekrar deneyiniz.', 500);
  }
}
