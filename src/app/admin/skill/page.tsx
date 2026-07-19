import { getSkillsRepo } from '@/lib/repositories';
import SkillEditor from './SkillEditor';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function SkillAdminPage() {
  const repo = await getSkillsRepo();
  const data = await repo.get();
  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>
        SKILL · 編集
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 24 }}>技能の編集</h1>
      <SkillEditor initial={data} />
    </div>
  );
}
