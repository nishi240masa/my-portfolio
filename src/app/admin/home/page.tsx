import { homeRepo } from '@/lib/repositories';
import HomeEditor from './HomeEditor';

export const dynamic = 'force-dynamic';

export default async function HomeAdminPage() {
  const data = await homeRepo.get();
  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>
        HOME · 編集
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 24 }}>トップページの編集</h1>
      <HomeEditor initial={data} />
    </div>
  );
}
