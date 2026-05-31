import HomeView from './_components/HomeView';
import { homeRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await homeRepo.get();
  return <HomeView data={data} />;
}
