import type { Metadata } from 'next';
import SkillView from './_components/SkillView';
import { getSkillsCached } from '@/lib/repositories';

// `getSkillsCached` は `@/lib/repositories` barrel から import しており、barrel が
// `JsonProductionRepository` などを static import するため、本ページに
// `runtime = 'edge'` を明示すると webpack edge SSR entry に `node:fs` が混入する。
// barrel rework (admin epic) を待ち、Phase 2 で edge 化する。
// それまでは `revalidate` ベースの ISR で静的化し CF Pages 互換を担保する。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'スキル',
  description:
    '西尾 匡生 (west) の保有スキル一覧 - Go / TypeScript を軸に、言語・フレームワーク・ツールを紹介します。',
  alternates: { canonical: '/skill' },
};

export default async function Page() {
  const data = await getSkillsCached();
  return <SkillView data={data} />;
}
