import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { auth } from '@/auth';
import AdminSignOutButton from './_components/AdminSignOutButton';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productions', label: 'Productions' },
  { href: '/admin/profile', label: 'Profile' },
  { href: '/admin/skill', label: 'Skill' },
  { href: '/admin/home', label: 'Home' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const email = session?.user?.email;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside
        style={{
          width: 240,
          borderRight: '1px solid var(--hairline)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--bg-elev)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--hairline)' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>
            ADMIN · 編集
          </div>
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18 }}>管理パネル</div>
        </div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            style={{
              padding: '10px 12px',
              fontFamily: 'var(--font-mincho)',
              fontSize: 14,
              textDecoration: 'none',
              color: 'var(--fg)',
              border: '1px solid transparent',
            }}
          >
            {n.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
          {email ? (
            <>
              <div className="t-meta" style={{ fontSize: 11, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email}
              </div>
              <AdminSignOutButton />
            </>
          ) : null}
          <Link href="/home" style={{ display: 'block', marginTop: 12, fontSize: 11, color: 'var(--fg-muted)', textDecoration: 'none' }}>
            ← サイトに戻る
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '32px 40px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
