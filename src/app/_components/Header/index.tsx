'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rakkan } from '../design/Wagara';
import { useThemeMode } from '../ThemeModeContext';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', jp: '序' },
  { href: '/production', label: 'Production', jp: '作' },
  { href: '/profile', label: 'Profile', jp: '人' },
  { href: '/skill', label: 'Skill', jp: '技' },
];

export default function Header() {
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(14px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          gap: 24,
        }}
      >
        <Link
          href="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            color: 'var(--fg)',
          }}
        >
          <Rakkan size={28} fontSize={12} />
          <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 17, letterSpacing: '0.12em' }}>
            west · Portfolio
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <nav aria-label="メインナビゲーション" style={{ display: 'flex', gap: 4 }}>
            {NAV_ITEMS.map((it) => {
              const active = pathname === it.href || pathname.startsWith(it.href + '/');
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={pathname === it.href ? 'page' : undefined}
                  style={{
                    position: 'relative',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-mincho)',
                    fontSize: 15,
                    letterSpacing: '0.18em',
                    textDecoration: 'none',
                    color: active ? 'var(--primary)' : 'var(--fg)',
                    opacity: active ? 1 : 0.75,
                    transition: 'color .35s, opacity .35s',
                  }}
                >
                  {it.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -2,
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'var(--primary)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={
              mode === 'dark'
                ? '現在ダークテーマです。クリックでライトテーマに切替'
                : '現在ライトテーマです。クリックでダークテーマに切替'
            }
            aria-pressed={mode === 'dark'}
            title={mode === 'dark' ? '昼（和紙）へ' : '夜（夜墨）へ'}
            className="theme-toggle"
            style={{
              marginLeft: 8,
              width: 34,
              height: 34,
              borderRadius: 4,
              border: '1px solid var(--hairline-strong)',
              background: 'transparent',
              color: 'var(--fg)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mincho)',
              fontSize: 15,
              lineHeight: 1,
              transition: 'border-color .35s, color .35s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mode === 'dark' ? '昼' : '夜'}
          </button>
        </div>
      </div>
    </header>
  );
}
