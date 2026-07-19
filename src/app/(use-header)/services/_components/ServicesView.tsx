import Link from 'next/link';
import SectionHeader from '@/app/_components/design/SectionHeader';
import TagList from '@/app/_components/design/Tags';
import { Rakkan } from '@/app/_components/design/Wagara';
import type { ServiceItem, ServicesContent } from '@/lib/schemas';

function ServiceCard({ item, index }: { item: ServiceItem; index: number }) {
  return (
    <div
      className="card"
      style={{ padding: 28, animation: `fadeIn .6s ${0.04 * index}s both` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 40,
            color: 'var(--primary)',
            lineHeight: 1,
            opacity: 0.85,
          }}
        >
          {item.kanji}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, letterSpacing: '0.04em', marginBottom: 6 }}>
            {item.title}
          </h3>
          <div className="t-meta">想定納期 · {item.turnaround}</div>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--fg)', marginBottom: 16 }}>
        {item.description}
      </p>
      <TagList tags={item.tags} />
    </div>
  );
}

export default function ServicesView({ data }: { data: ServicesContent }) {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="COMMISSION · ご依頼" title="お仕事のご依頼" kanji="依" />

      {/* opacity は付けない: .t-meta (--fg-muted) は単体で 4.5:1、opacity で薄めると AA 割れ */}
      <div className="t-meta" style={{ marginBottom: 24, fontSize: 12, lineHeight: 1.9 }}>
        {data.intro}
      </div>

      <aside
        aria-label="開発の進め方"
        style={{
          marginBottom: 48,
          padding: 20,
          border: '1px solid var(--hairline)',
          background: 'var(--bg-elev)',
        }}
      >
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>
          開発の進め方 · HOW I WORK
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--fg)' }}>{data.aiNote}</p>
      </aside>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 24,
        }}
      >
        {data.items.map((item, i) => (
          <ServiceCard key={item.title} item={item} index={i} />
        ))}
      </div>

      <div className="t-meta" style={{ marginTop: 24 }}>
        {data.turnaroundNote}
      </div>

      <div
        style={{
          marginTop: 80,
          paddingTop: 48,
          borderTop: '1px solid var(--hairline)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 22,
            letterSpacing: '0.06em',
            textWrap: 'pretty',
          }}
        >
          {data.contactCta}
        </div>
        <Link
          href="/contact"
          className="btn-primary"
          aria-label="Contact · 相談する"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            textDecoration: 'none',
            fontFamily: 'var(--font-mincho)',
            // NextStepCTA の primary と同じ faint-tint 流儀。solid 朱背景だと落款 (--shu) が沈む
            background: 'color-mix(in oklab, var(--primary) 12%, transparent)',
            border: '1px solid var(--primary)',
            // faint-tint 背景では --primary 直だと AA 割れするため深朱/淡朱に
            color: 'var(--primary-strong)',
          }}
        >
          <Rakkan char="連" size={26} fontSize={12} />
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
            <span className="t-eyebrow" style={{ fontSize: 10, color: 'inherit' }}>
              Contact
            </span>
            <span style={{ fontSize: 15 }}>相談する</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
