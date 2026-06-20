import type { Metadata } from 'next';
import SkillView from './_components/SkillView';
import { getSkillsCached } from '@/lib/repositories';

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
