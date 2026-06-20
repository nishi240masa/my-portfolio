import { notFound } from 'next/navigation';
import { productionRepo } from '@/lib/repositories';
import ProductionDetail from './ProductionDetail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, all] = await Promise.all([
    productionRepo.getById(Number(id)),
    productionRepo.listSummary(),
  ]);
  if (article == null) {
    notFound();
  }
  return <ProductionDetail article={article} all={all} />;
}
