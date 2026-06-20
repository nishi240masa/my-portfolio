import type { Metadata } from 'next';
import SkillView from './_components/SkillView';
import { getSkillsCached } from '@/lib/repositories';

// Phase 2 で edge 化予定 (#28 レビュー応答):
// `@/lib/repositories` barrel 経由で node:fs が edge bundle に混入するため、
// barrel rework が完了する admin Phase まで Next.js default (nodejs) のままにする。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'スキル',
  description: '西尾 匡生の保有スキル一覧 - 言語・フレームワーク・ツールなど。',
  alternates: { canonical: '/skill' },
};

export default async function Page() {
  const data = await getSkillsCached();
  return <SkillView data={data} />;
}
