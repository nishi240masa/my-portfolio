import type { Metadata } from 'next';
import Link from 'next/link';
import { getLandingEn } from '@/lib/i18n';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'west · Portfolio (EN)',
  description:
    'English summary of Masaki Nishio (west) — a backend-focused software engineer based in Japan.',
  alternates: {
    canonical: '/en',
    languages: {
      ja: '/',
      en: '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    locale: 'en_US',
    title: 'west · Portfolio (EN)',
    description:
      'English summary of Masaki Nishio (west) — a backend-focused software engineer based in Japan.',
  },
};

export default async function EnLandingPage() {
  const data = await getLandingEn();

  return (
    <section lang="en" className="page-enter" style={{ paddingTop: 0 }}>
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* ===== Hero ===== */}
        <header style={{ marginBottom: 56 }}>
          <p
            className="t-meta"
            style={{ marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Portfolio · EN
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {data.hero.headline}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            {data.hero.tagline}
          </p>
          <p style={{ marginTop: 24, fontSize: 14, color: 'var(--ink-soft)' }}>
            {data.hero.name} <span aria-hidden="true">·</span> &ldquo;{data.hero.alias}&rdquo;
          </p>
        </header>

        {/* ===== Role ===== */}
        <section style={{ marginBottom: 56 }} aria-labelledby="en-role">
          <h2
            id="en-role"
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 24,
              marginBottom: 16,
              borderBottom: '1px solid var(--hairline-strong)',
              paddingBottom: 8,
            }}
          >
            {data.role.title}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>{data.role.summary}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            <strong>{data.role.lookingFor}</strong>
          </p>
        </section>

        {/* ===== Skills ===== */}
        <section style={{ marginBottom: 56 }} aria-labelledby="en-skills">
          <h2
            id="en-skills"
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 24,
              marginBottom: 16,
              borderBottom: '1px solid var(--hairline-strong)',
              paddingBottom: 8,
            }}
          >
            Skills
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {data.skills.map((group) => (
              <div key={group.category}>
                <h3
                  style={{
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: 8,
                  }}
                >
                  {group.category}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: 15,
                        lineHeight: 1.8,
                        borderBottom: '1px dashed var(--hairline)',
                        padding: '4px 0',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Contact ===== */}
        <section style={{ marginBottom: 56 }} aria-labelledby="en-contact">
          <h2
            id="en-contact"
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 24,
              marginBottom: 16,
              borderBottom: '1px solid var(--hairline-strong)',
              paddingBottom: 8,
            }}
          >
            Contact
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>{data.contact.intro}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.contact.links.map((link) => (
              <li key={link.label} style={{ padding: '8px 0' }}>
                <span style={{ display: 'inline-block', minWidth: 80, color: 'var(--ink-soft)' }}>
                  {link.label}
                </span>
                <a
                  href={link.url}
                  style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                >
                  {link.handle}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Note + JA link ===== */}
        <footer
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: '1px solid var(--hairline)',
            fontSize: 13,
            color: 'var(--ink-soft)',
            lineHeight: 1.7,
          }}
        >
          <p style={{ marginBottom: 8 }}>{data.note}</p>
          <p>
            <Link href="/" hrefLang="ja" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
              日本語版へ / View Japanese version
            </Link>
          </p>
        </footer>
      </div>
    </section>
  );
}
