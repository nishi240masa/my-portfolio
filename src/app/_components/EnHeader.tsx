'use client';

import Link from 'next/link';
import { Rakkan } from './design/Wagara';
import { useThemeMode } from './ThemeModeContext';

/**
 * EN-only minimal header for /en landing.
 * Uses English labels and links back to the JA site for full content.
 */
export default function EnHeader() {
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
          href="/en"
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
          <nav aria-label="Main navigation" style={{ display: 'flex', gap: 4 }}>
            <Link
              href="/"
              hrefLang="ja"
              style={{
                padding: '8px 16px',
                fontFamily: 'var(--font-mincho)',
                fontSize: 15,
                letterSpacing: '0.18em',
                textDecoration: 'none',
                color: 'var(--fg)',
                opacity: 0.75,
                transition: 'color .35s, opacity .35s',
              }}
            >
              JA
            </Link>
          </nav>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={
              mode === 'dark'
                ? 'Currently dark theme. Click to switch to light.'
                : 'Currently light theme. Click to switch to dark.'
            }
            aria-pressed={mode === 'dark'}
            title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}
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
            {mode === 'dark' ? 'Day' : 'Night'}
          </button>
        </div>
      </div>
    </header>
  );
}
