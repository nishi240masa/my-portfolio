import { profileRepo } from '@/lib/repositories/sync';
import { requireAdmin } from '@/lib/admin/auth';
import { profileSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await profileRepo.get();
  return Response.json({ data });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const updated = await profileRepo.update(parsed.data);
  return Response.json({ data: updated });
}
