import type { Metadata } from 'next';
import ProductionPage from './_components/ProductionPage';
import { listProductionsSummaryCached } from '@/lib/repositories';

// Phase 2 で edge 化予定 (#28 レビュー応答):
// `@/lib/repositories` barrel 経由で node:fs が edge bundle に混入するため、
// barrel rework が完了する admin Phase まで Next.js default (nodejs) のままにする。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: '制作物',
  description: '西尾 匡生の制作物・プロダクト一覧。',
  alternates: { canonical: '/production' },
};

export default async function Page() {
  const data = await listProductionsSummaryCached();
  return <ProductionPage data={data} />;
}
