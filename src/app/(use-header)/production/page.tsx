import ProductionPage from './_components/ProductionPage';
import { productionRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await productionRepo.listSummary();
  return <ProductionPage data={data} />;
}
