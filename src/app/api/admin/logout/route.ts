import { ok } from '@/lib/http';
import { clearAdminCookie } from '@/lib/auth';

export async function POST() {
  const res = ok();
  clearAdminCookie(res);
  return res;
}
