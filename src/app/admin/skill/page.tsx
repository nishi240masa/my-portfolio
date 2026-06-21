import { skillsRepo } from '@/lib/repositories/sync';
import SkillEditor from './SkillEditor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function SkillAdminPage() {
  const data = await skillsRepo.get();
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
