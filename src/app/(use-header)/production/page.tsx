import type { Metadata } from 'next';
import ProductionPage from './_components/ProductionPage';
import { listProductionsSummaryCached } from '@/lib/repositories';

export const runtime = 'nodejs';
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
