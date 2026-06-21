import { getHomeRepo } from '@/lib/repositories';
import { requireAdmin } from '@/lib/admin/auth';
import { homeSchema } from '@/lib/admin/schemas';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const repo = await getHomeRepo();
  const data = await repo.get();
  return Response.json({ data });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const parsed = homeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const repo = await getHomeRepo();
  const updated = await repo.update(parsed.data);
  return Response.json({ data: updated });
}
