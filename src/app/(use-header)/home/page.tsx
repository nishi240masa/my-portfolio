import type { Metadata } from 'next';
import HomeView from './_components/HomeView';
import { homeRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ホーム',
  description: '西尾 匡生のポートフォリオ - ホーム。未来のある開発を、意味のある人生を。',
  alternates: { canonical: '/home' },
};

export default async function Page() {
  const data = await homeRepo.get();
  return <HomeView data={data} />;
}
