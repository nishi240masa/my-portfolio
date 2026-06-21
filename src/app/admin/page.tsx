import Link from 'next/link';
import { productionRepo, profileRepo, skillsRepo, homeRepo } from '@/lib/repositories/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [productions, profile, skills, home] = await Promise.all([
    productionRepo.list(),
    profileRepo.get(),
    skillsRepo.get(),
    homeRepo.get(),
  ]);

  const sections = [
    {
      href: '/admin/productions',
      title: 'Productions',
      jp: '作品',
      count: `${productions.length} 件`,
    },
    { href: '/admin/profile', title: 'Profile', jp: '人物像', count: `${profile.bioParagraphs.length} 段落` },
    {
      href: '/admin/skill',
      title: 'Skill',
      jp: '技能',
      count: `${skills.categories.length} カテゴリ / ${skills.tools.length} ツール`,
    },
    { href: '/admin/home', title: 'Home', jp: 'トップ', count: `${home.indexItems.length} セクション` },
  ];

  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>
        DASHBOARD · 編集メニュー
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 32, marginBottom: 32 }}>管理パネル</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'block',
              padding: 24,
              border: '1px solid var(--hairline)',
              background: 'var(--bg-elev)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div className="t-eyebrow" style={{ marginBottom: 8 }}>
              {s.title}
            </div>
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, marginBottom: 8 }}>{s.jp}</div>
            <div className="t-meta">{s.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
