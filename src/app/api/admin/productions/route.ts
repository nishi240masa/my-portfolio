import { getProductionRepo } from '@/lib/repositories';
import { requireAdmin } from '@/lib/admin/auth';
import { productionSchema } from '@/lib/admin/schemas';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const repo = await getProductionRepo();
  const items = await repo.list();
  return Response.json({ items });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const parsed = productionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const repo = await getProductionRepo();
  const created = await repo.create(parsed.data);
  return Response.json({ item: created }, { status: 201 });
}
