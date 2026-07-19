import SectionHeader, { SubSection } from '@/app/_components/design/SectionHeader';
import Tategaki from '@/app/_components/design/Tategaki';
import { PortraitPlaceholder } from '@/app/_components/design/Placeholders';
import { Rakkan } from '@/app/_components/design/Wagara';
import type { Profile, TimelineItem } from '@/types/profile';

function TimelineColumn({
  title,
  kanji,
  jp,
  items,
}: {
  title: string;
  kanji: string;
  jp: string;
  items: TimelineItem[];
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 32, color: 'var(--primary)', lineHeight: 1 }}>{kanji}</span>
        <div>
          <div className="t-eyebrow">{title}</div>
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 20 }}>{jp}</div>
        </div>
      </div>
      <div style={{ borderLeft: '1px solid var(--hairline-strong)', paddingLeft: 24 }}>
        {items.map((it, i) => (
          <div key={i} style={{ marginBottom: 28, position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: -29,
                top: 8,
                width: 8,
                height: 8,
                background: 'var(--primary)',
                borderRadius: '50%',
                boxShadow: '0 0 0 4px var(--bg)',
              }}
            />
            <div className="t-meta" style={{ marginBottom: 4 }}>
              {it.year}
            </div>
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 16, marginBottom: 2 }}>{it.label}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{it.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileView({ data }: { data: Profile }) {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="PROFILE · 自己紹介" title="人物像。" kanji="人" />

      <div className="profile-intro-grid" style={{ marginBottom: 96 }}>
        <div style={{ position: 'relative' }}>
          <PortraitPlaceholder size={320} label="PORTRAIT · 顔写真" src={data.portraitSrc} />
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Rakkan size={40} fontSize={16} />
            <div>
              <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18, letterSpacing: '0.12em' }}>{data.nameJp}</div>
              <div className="t-meta" style={{ marginTop: 2 }}>
                {data.nameEn} · {data.nickname}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="t-eyebrow" style={{ marginBottom: 16 }}>
            ABOUT ME · 自己紹介
          </div>
          <h2 className="t-h2" style={{ marginBottom: 20, fontSize: 28, textWrap: 'balance' }}>
            {data.headline}
          </h2>
          {data.bioParagraphs.map((p, i) => (
            <div
              key={i}
              className="t-body"
              style={{ color: 'var(--fg)', textWrap: 'pretty', marginBottom: i < data.bioParagraphs.length - 1 ? 16 : 0 }}
            >
              {p}
            </div>
          ))}

          <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {data.sns.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn"
                style={{ padding: '10px 16px', fontSize: 12 }}
              >
                <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 14, marginRight: 6 }}>{s.label}</span>
                <span className="t-meta" style={{ fontSize: 11 }}>
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="timeline-grid" style={{ marginBottom: 96 }}>
        <TimelineColumn title="Education" kanji="学" jp="学歴" items={data.education} />
        <TimelineColumn title="Experience" kanji="歴" jp="経歴" items={data.experience} />
      </div>

      <div style={{ marginBottom: 96 }}>
        <SubSection eyebrow="INTERESTS · 関心" title="興味のある領域" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.interests.map((it, i) => (
            <span
              key={it}
              className="tag"
              style={{
                fontSize: 13,
                padding: '8px 16px',
                fontFamily: 'var(--font-mincho)',
                letterSpacing: '0.08em',
                background: i % 3 === 0 ? 'color-mix(in oklab, var(--primary) 6%, transparent)' : 'transparent',
                borderColor: i % 3 === 0 ? 'var(--primary)' : 'var(--hairline)',
                // tint 背景上の小テキストは AA 確保のため深朱/淡朱 (--primary-strong)
                color: i % 3 === 0 ? 'var(--primary-strong)' : 'var(--fg)',
              }}
            >
              {it}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          borderTop: '1px solid var(--hairline)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <div style={{ display: 'inline-flex', gap: 24, justifyContent: 'center' }}>
          <Tategaki style={{ fontFamily: 'var(--font-mincho)', fontSize: 28, lineHeight: 2, letterSpacing: '0.2em' }}>
            {data.closingLeft}
          </Tategaki>
          <Tategaki
            style={{ fontFamily: 'var(--font-mincho)', fontSize: 28, lineHeight: 2, letterSpacing: '0.2em', color: 'var(--primary)' }}
          >
            {data.closingRight}
          </Tategaki>
        </div>
      </div>
    </section>
  );
}
