import { NextRequest } from 'next/server';
import { ok, fail, readBody, unauthorized } from '@/lib/http';
import { getAdmin } from '@/lib/auth';
import { validateRegistration } from '@/lib/validation';
import { deleteRegistration, getRegistration, updateRegistration, DuplicateEmailError } from '@/lib/registrations';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

/** Full edit, or `{ checkedIn }` alone for the quick check-in toggle. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!getAdmin(req)) return unauthorized();
  const body = await readBody(req);

  let fields;
  if (Object.keys(body).length === 1 && typeof body.checkedIn === 'boolean') {
    fields = { checkedIn: body.checkedIn };
  } else {
    const current = await getRegistration(params.id);
    if (!current) return fail('Kayıt bulunamadı.', 404);
    const result = validateRegistration({ ...current, ...body }, 'admin');
    if (!result.ok) return fail(result.error);
    fields = result.data;
  }

  try {
    const registration = await updateRegistration(params.id, fields);
    if (!registration) return fail('Kayıt bulunamadı.', 404);
    return ok({ registration });
  } catch (e) {
    if (e instanceof DuplicateEmailError) return fail('Bu e-posta adresiyle kayıtlı başka bir kişi var.', 409);
    throw e;
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!getAdmin(req)) return unauthorized();
  if (!(await deleteRegistration(params.id))) return fail('Kayıt bulunamadı.', 404);
  return ok();
}
