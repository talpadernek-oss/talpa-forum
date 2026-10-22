import { NextRequest } from 'next/server';
import { ok, fail, readBody, unauthorized } from '@/lib/http';
import { getAdmin } from '@/lib/auth';
import { validateRegistration } from '@/lib/validation';
import { createRegistration, listRegistrations, DuplicateEmailError } from '@/lib/registrations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!getAdmin(req)) return unauthorized();
  return ok({ registrations: await listRegistrations() });
}

/** Manual entry from the admin panel. */
export async function POST(req: NextRequest) {
  if (!getAdmin(req)) return unauthorized();
  const result = validateRegistration(await readBody(req), 'admin');
  if (!result.ok) return fail(result.error);
  try {
    return ok({ registration: await createRegistration(result.data, 'manual') });
  } catch (e) {
    if (e instanceof DuplicateEmailError) return fail('Bu e-posta adresiyle kayıtlı bir kişi zaten var.', 409);
    throw e;
  }
}
