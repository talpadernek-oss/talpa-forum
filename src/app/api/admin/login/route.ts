import { NextRequest } from 'next/server';
import { ok, fail, readBody } from '@/lib/http';
import { setAdminCookie, verifyAdminCredentials } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { username = '', password = '' } = await readBody<{ username?: string; password?: string }>(req);
  if (!verifyAdminCredentials(String(username), String(password))) {
    await new Promise(r => setTimeout(r, 600));
    return fail('Kullanıcı adı veya şifre hatalı.', 401);
  }
  const res = ok();
  setAdminCookie(res, String(username).trim());
  return res;
}
