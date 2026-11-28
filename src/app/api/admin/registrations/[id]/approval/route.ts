import { NextRequest } from 'next/server';
import { ok, fail, unauthorized } from '@/lib/http';
import { getAdmin } from '@/lib/auth';
import { getRegistration, markApprovalSent } from '@/lib/registrations';
import { mailConfigured, sendApprovalEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

/** Sends the "participation confirmed" e-mail to one registration (the panel loops for bulk sending). */
export async function POST(req: NextRequest, { params }: Ctx) {
  if (!getAdmin(req)) return unauthorized();
  if (!mailConfigured()) return fail('E-posta ayarları (SMTP) tanımlı değil; mail gönderilemiyor.', 503);

  const reg = await getRegistration(params.id);
  if (!reg) return fail('Kayıt bulunamadı.', 404);
  if (!reg.email) return fail('Bu kaydın e-posta adresi yok.');

  try {
    await sendApprovalEmail(reg.email, reg.fullName, reg.lang === 'en' ? 'en' : 'tr');
  } catch (e) {
    console.error('approval e-mail failed', reg.email, e);
    return fail(`${reg.email} adresine mail gönderilemedi.`, 502);
  }
  return ok({ registration: await markApprovalSent(reg.id) });
}
