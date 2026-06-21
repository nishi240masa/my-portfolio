import { getProductionRepo } from '@/lib/repositories';
import { requireAdmin } from '@/lib/admin/auth';
import { productionPatchSchema } from '@/lib/admin/schemas';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const repo = await getProductionRepo();
  const item = await repo.getById(Number(id));
  if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ item });
}

export async function PUT(req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await req.json();
  const parsed = productionPatchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const repo = await getProductionRepo();
    const updated = await repo.update(Number(id), parsed.data);
    return Response.json({ item: updated });
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  try {
    const repo = await getProductionRepo();
    await repo.delete(Number(id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
