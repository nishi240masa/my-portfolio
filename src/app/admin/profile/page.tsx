import { getProfileRepo } from '@/lib/repositories';
import ProfileEditor from './ProfileEditor';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ProfileAdminPage() {
  const repo = await getProfileRepo();
  const data = await repo.get();
  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>
        PROFILE · 編集
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 24 }}>人物像の編集</h1>
      <ProfileEditor initial={data} />
    </div>
  );
}
