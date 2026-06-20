import type { Metadata } from 'next';
import ProductionPage from './_components/ProductionPage';
import { listProductionsSummaryCached } from '@/lib/repositories';

// `listProductionsSummaryCached` は `@/lib/repositories` barrel から import しており、
// barrel が `JsonProductionRepository` を static import するため、本ページに
// `runtime = 'edge'` を明示すると webpack edge SSR entry に `node:fs` が混入する。
// barrel rework (admin epic) を待ち、Phase 2 で edge 化する。
// それまでは `revalidate` ベースの ISR で静的化し CF Pages 互換を担保する。
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
