import { notFound } from 'next/navigation';
import {
  getProductionByIdCached,
  listProductionsCached,
  listProductionsSummaryCached,
} from '@/lib/repositories';
import MarkdownContent from './MarkdownContent';
import ProductionDetail from './ProductionDetail';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function generateStaticParams() {
  const items = await listProductionsCached();
  return items.map((item) => ({ id: String(item.id) }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, all] = await Promise.all([
    getProductionByIdCached(Number(id)),
    listProductionsSummaryCached(),
  ]);
  if (article == null) {
    notFound();
  }
  return (
    <ProductionDetail
      article={article}
      all={all}
      markdown={<MarkdownContent content={article.content} />}
    />
  );
}
