import type { Metadata } from 'next';
import HomeView from './_components/HomeView';
import { getHomeCached } from '@/lib/repositories';

// `getHomeCached` は `@/lib/repositories` barrel から import しており、barrel が
// `JsonProductionRepository` を static import するため、本ページに
// `runtime = 'edge'` を明示すると webpack edge SSR entry に `node:fs` が混入する。
// barrel の lazy/conditional 化 (admin epic / PR-B-admin-edge) を待ち、Phase 2 で
// edge 化する。それまでは Next.js default (nodejs) + `revalidate` ベースの ISR で
// 静的化することにより CF Pages 互換を担保する。
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
