import type { Metadata } from 'next';
import SkillView from './_components/SkillView';
import { skillsRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'スキル',
  description: '西尾 匡生の保有スキル一覧 - 言語・フレームワーク・ツールなど。',
  alternates: { canonical: '/skill' },
};

export default async function Page() {
  const data = await skillsRepo.get();
  return <SkillView data={data} />;
}
