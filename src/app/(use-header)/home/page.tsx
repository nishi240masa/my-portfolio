import type { Metadata } from 'next';
import HomeView from './_components/HomeView';
import { getHomeCached } from '@/lib/repositories';

// Phase 2 で edge 化予定 (#28 レビュー応答):
// 現状 `@/lib/repositories` の barrel が JsonProductionRepository を static import
// しており、`runtime='edge'` を明示すると edge bundle に node:fs が混入して build が落ちる。
// barrel を lazy/conditional import 化する admin Phase (PR-B-admin-edge) と合わせて
// `runtime='edge'` を明示する。本 PR では Next.js の default (nodejs) のままにする。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'ホーム',
  description: '西尾 匡生のポートフォリオ - ホーム。未来のある開発を、意味のある人生を。',
  alternates: { canonical: '/home' },
};

export default async function Page() {
  const data = await getHomeCached();
  return <HomeView data={data} />;
}
