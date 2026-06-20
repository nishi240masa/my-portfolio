import SectionHeader, { SubSection } from '@/app/_components/design/SectionHeader';
import { EmptyState } from '@/app/_components/design/States';
import type { SkillCategory, SkillItem, SkillsContent } from '@/types/skill';

const RANK_LABELS = ['初段', '壱段', '弐段', '参段', '四段', '五段', '六段'];
const LEGEND_LABELS = ['初段', '壱段', '弐段', '参段', '四段', '五段', '六段', '極段'];
const DAN_LEGEND_ID = 'dan-legend';

function rankFor(level: number): number {
  return Math.min(6, Math.max(0, Math.round((level / 100) * 6)));
}

function DanIndicator({ level, years }: { level: number; years: string }) {
  const rank = rankFor(level);
  const rankLabel = RANK_LABELS[rank];
  const valueText = `${rankLabel} (${rank}/6, ${years})`;
  return (
    <div
      role="meter"
      aria-valuenow={rank}
      aria-valuemin={0}
      aria-valuemax={6}
      aria-valuetext={valueText}
      aria-describedby={DAN_LEGEND_ID}
      style={{ display: 'flex', gap: 4, alignItems: 'center' }}
    >
      {[1, 2, 3, 4, 5, 6].map((n) => {
        const filled = n <= rank;
        return (
          <span
            key={n}
            aria-hidden="true"
            className={filled ? 'dan-cell dan-cell-filled' : 'dan-cell dan-cell-empty'}
            style={{
              width: 24,
              height: 24,
              border: '1px solid',
              borderColor: filled ? 'var(--primary)' : 'var(--hairline)',
              color: filled ? 'var(--primary-on)' : 'var(--fg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mincho)',
              fontSize: 12,
              transition: 'all .35s',
            }}
          >
            {n}
          </span>
        );
      })}
    </div>
  );
}

function SkillRow({ skill, index }: { skill: SkillItem; index: number }) {
  const rank = rankFor(skill.level);
  return (
    <div className="skill-row" style={{ animation: `fadeIn .6s ${0.04 * index}s both` }}>
      <div className="skill-name">
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 17, marginBottom: 2 }}>{skill.name}</div>
        <div className="t-meta" style={{ fontSize: 10 }}>
          {skill.note || '—'}
        </div>
      </div>
      <div className="skill-viz">
        <DanIndicator level={skill.level} years={skill.years} />
      </div>
      <div className="skill-years" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
        {skill.years}
      </div>
      <div
        className="skill-rank"
        style={{ textAlign: 'center', fontFamily: 'var(--font-mincho)', fontSize: 14, color: 'var(--primary)', letterSpacing: '0.05em' }}
      >
        {RANK_LABELS[rank]}
      </div>
    </div>
  );
}

function SkillCategoryBlock({ category }: { category: SkillCategory }) {
  return (
    <div style={{ position: 'relative', paddingBottom: 32, borderBottom: '1px solid var(--hairline)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
        <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 64, color: 'var(--primary)', lineHeight: 0.9, opacity: 0.85 }}>
          {category.kanji}
        </span>
        <div style={{ flex: 1, paddingBottom: 8 }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>
            {category.en.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, letterSpacing: '0.04em' }}>{category.en}</h3>
        </div>
        <span className="t-meta">{category.items.length} 項目</span>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {category.items.map((s, i) => (
          <SkillRow key={s.name} skill={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function DanLegend() {
  return (
    <aside
      id={DAN_LEGEND_ID}
      aria-label="段位の見方"
      style={{
        marginBottom: 32,
        padding: 20,
        border: '1px solid var(--hairline)',
        background: 'var(--bg-elev)',
      }}
    >
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>
        段位の見方 · DAN LEGEND
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          marginBottom: 12,
          fontFamily: 'var(--font-mincho)',
          fontSize: 13,
        }}
      >
        {LEGEND_LABELS.map((label, i) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--fg-muted)',
              }}
            >
              {i}
            </span>
            <span>{label}</span>
          </span>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--fg-muted)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            aria-hidden="true"
            className="dan-cell dan-cell-filled"
            style={{
              width: 18,
              height: 18,
              border: '1px solid var(--primary)',
              display: 'inline-block',
            }}
          />
          満マス(墨ベタ) = 到達済み
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            aria-hidden="true"
            className="dan-cell dan-cell-empty"
            style={{
              width: 18,
              height: 18,
              border: '1px solid var(--hairline)',
              display: 'inline-block',
            }}
          />
          空マス = 習熟度不足
        </span>
      </div>
    </aside>
  );
}

export default function SkillView({ data }: { data: SkillsContent }) {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="SKILL · 技能" title="現在地、段位として。" kanji="技" />

      <div className="t-meta" style={{ marginBottom: 24, opacity: 0.7 }}>
        {data.intro}
      </div>

      <DanLegend />

      <div style={{ display: 'grid', gap: 56 }}>
        {data.categories.map((category) => (
          <SkillCategoryBlock key={category.en} category={category} />
        ))}
      </div>

      <div style={{ marginTop: 96 }}>
        <SubSection eyebrow="TOOLS & SOFTWARE · 道具" title="日々の道具" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.tools.map((t) => (
            <span key={t} className="tag" style={{ fontSize: 12, padding: '6px 14px', fontFamily: 'var(--font-mincho)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 80 }}>
        <SubSection eyebrow="CERTIFICATIONS · 資格" title="記録のあるもの" />
        {data.certifications.length === 0 ? (
          <EmptyState title="記載できる資格はまだありません" subtitle="No certifications yet." />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              border: '1px solid var(--hairline)',
            }}
          >
            {data.certifications.map((c, i) => (
              <div
                key={c.name}
                style={{
                  padding: 24,
                  borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: '1px solid var(--hairline)',
                  background: 'var(--bg-elev)',
                  position: 'relative',
                }}
              >
                <div className="t-meta" style={{ marginBottom: 8 }}>
                  {c.year} · {c.org}
                </div>
                <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18, lineHeight: 1.4 }}>{c.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
