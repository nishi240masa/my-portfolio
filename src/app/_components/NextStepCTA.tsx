'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rakkan } from './design/Wagara';

type CTA = {
  href: string;
  label: string;
  jp: string;
  kanji: string;
  variant: 'primary' | 'ghost';
};

type CTAPair = {
  eyebrow: string;
  title: string;
  primary: CTA;
  secondary: CTA;
};

const HOME_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: 'まず作品を見て、人物像へ。',
  primary: { href: '/production', label: 'Production', jp: '作品を見る', kanji: '作', variant: 'primary' },
  secondary: { href: '/profile', label: 'Profile', jp: '人物像へ', kanji: '人', variant: 'ghost' },
};

const PRODUCTION_LIST_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: '気になる作品があれば、人物像と連絡へ。',
  primary: { href: '/profile', label: 'Profile', jp: '人物像へ', kanji: '人', variant: 'primary' },
  secondary: { href: '/contact', label: 'Contact', jp: '連絡する', kanji: '連', variant: 'ghost' },
};

const PRODUCTION_DETAIL_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: 'もっと作品を、あるいは直接お話を。',
  primary: { href: '/production', label: 'Production', jp: '一覧へ戻る', kanji: '作', variant: 'primary' },
  secondary: { href: '/contact', label: 'Contact', jp: '連絡する', kanji: '連', variant: 'ghost' },
};

const PROFILE_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: '人物が気になったら、作品か連絡へ。',
  primary: { href: '/production', label: 'Production', jp: '作品を見る', kanji: '作', variant: 'primary' },
  secondary: { href: '/contact', label: 'Contact', jp: '連絡する', kanji: '連', variant: 'ghost' },
};

const SKILL_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: '技を見たなら、作品か連絡へ。',
  primary: { href: '/production', label: 'Production', jp: '作品を見る', kanji: '作', variant: 'primary' },
  secondary: { href: '/contact', label: 'Contact', jp: '連絡する', kanji: '連', variant: 'ghost' },
};

const CONTACT_CTA: CTAPair = {
  eyebrow: 'NEXT STEP · 次へ',
  title: 'まずは作品か人物像を覗いてみる。',
  primary: { href: '/production', label: 'Production', jp: '作品を見る', kanji: '作', variant: 'primary' },
  secondary: { href: '/profile', label: 'Profile', jp: '人物像へ', kanji: '人', variant: 'ghost' },
};

const DEFAULT_CTA: CTAPair = HOME_CTA;

function resolveCTA(pathname: string): CTAPair {
  if (pathname === '/' || pathname === '/home' || pathname.startsWith('/home/')) return HOME_CTA;
  if (pathname === '/contact') return CONTACT_CTA;
  if (pathname === '/profile' || pathname.startsWith('/profile/')) return PROFILE_CTA;
  if (pathname === '/skill' || pathname.startsWith('/skill/')) return SKILL_CTA;
  if (pathname === '/production') return PRODUCTION_LIST_CTA;
  if (pathname.startsWith('/production/')) return PRODUCTION_DETAIL_CTA;
  return DEFAULT_CTA;
}

function CTAButton({ cta }: { cta: CTA }) {
  const isPrimary = cta.variant === 'primary';
  return (
    <Link
      href={cta.href}
      className={isPrimary ? 'btn-primary' : 'btn'}
      aria-label={`${cta.label} · ${cta.jp}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        textDecoration: 'none',
        fontFamily: 'var(--font-mincho)',
        background: isPrimary
          ? 'color-mix(in oklab, var(--primary) 12%, transparent)'
          : undefined,
        border: isPrimary
          ? '1px solid var(--primary)'
          : '1px solid var(--hairline-strong)',
        color: isPrimary ? 'var(--primary)' : 'var(--fg)',
      }}
    >
      <Rakkan char={cta.kanji} size={26} fontSize={12} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
        <span className="t-eyebrow" style={{ fontSize: 10 }}>
          {cta.label}
        </span>
        <span style={{ fontSize: 15 }}>{cta.jp}</span>
      </span>
    </Link>
  );
}

/**
 * NextStepCTA — 現在地別に「次の2導線」を提示する CTA セクション
 * Footer の直前に置く想定（layout に組み込み）。
 */
export default function NextStepCTA() {
  const pathname = usePathname() ?? '/';
  const cta = resolveCTA(pathname);

  return (
    <section
      aria-label="次の導線"
      className="container"
      style={{
        marginTop: 80,
        paddingTop: 48,
        paddingBottom: 16,
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>
            {cta.eyebrow}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 22,
              letterSpacing: '0.06em',
              textWrap: 'pretty',
            }}
          >
            {cta.title}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <CTAButton cta={cta.primary} />
          <CTAButton cta={cta.secondary} />
        </div>
      </div>
    </section>
  );
}
