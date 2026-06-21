import { notFound } from 'next/navigation';
import { productionRepo } from '@/lib/repositories/sync';
import ProductionEditor from '../_components/ProductionEditor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function EditProductionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await productionRepo.getById(Number(id));
  if (!item) notFound();
  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>
        PRODUCTIONS · 編集 #{item.id}
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 24 }}>{item.title}</h1>
      <ProductionEditor initial={item} id={item.id} />
    </div>
  );
}
