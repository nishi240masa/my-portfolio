import { productionRepo } from '@/lib/repositories';
import { requireAdmin } from '@/lib/admin/auth';
import { productionSchema } from '@/lib/admin/schemas';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const items = await productionRepo.list();
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
  const created = await productionRepo.create(parsed.data);
  return Response.json({ item: created }, { status: 201 });
}
