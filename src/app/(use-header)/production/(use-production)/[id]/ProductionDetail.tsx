'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import Tategaki from '@/app/_components/design/Tategaki';
import RelatedPosts from './_components/RelatedPosts';
import type { CaseStudy, Post, PostPage } from '@/types/post';

export default function ProductionDetail({
  article,
  all,
  markdown,
}: {
  article: PostPage;
  all: Post[];
  markdown: ReactNode;
}) {
  const router = useRouter();
  const cs = article.caseStudy;
  const isCaseStudy = cs != null;

  // ケーススタディ定義時はそちらの role/period/stack を優先表示する
  const meta = [
    { label: 'ROLE · 役割', value: cs?.role || article.role },
    {
      label: 'TEAM · 人数',
      value: cs?.teamSize ? cs.teamSize : `${article.peopleNum}名`,
    },
    { label: 'PERIOD · 期間', value: cs?.period || article.period },
    {
      label: 'STACK · 使用技術',
      value: (cs?.stack && cs.stack.length > 0 ? cs.stack : article.technologys).join(' / '),
    },
  ];

  return (
    <article className="page-enter container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 1080 }}>
      <div style={{ marginBottom: 32 }}>
        <button
          type="button"
          className="btn"
          onClick={() => router.push('/production')}
          style={{ fontSize: 12, padding: '8px 16px' }}
        >
          <span style={{ opacity: 0.5 }}>←</span> Production 一覧
        </button>
      </div>

      <header style={{ marginBottom: 48 }}>
        <div className="t-eyebrow" style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>{article.date} · WORK</span>
          <KindBadge isCaseStudy={isCaseStudy} />
        </div>
        <h1 className="t-h1" style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 16 }}>
          {article.title}
        </h1>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 22, color: 'var(--fg-muted)', marginBottom: 24 }}>
          {article.description}
        </div>
        <TagList tags={article.tags} solid />
      </header>

      <ImagePlaceholder label={`MAIN VISUAL · ${article.title}`} ratio="21/9" src={article.image} style={{ marginBottom: 48 }} />

      <div className="meta-grid-4" style={{ marginBottom: 56 }}>
        {meta.map((m) => (
          <div key={m.label}>
            <div className="t-eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: 'var(--font-mincho)', lineHeight: 1.4 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {cs != null ? <CaseStudyBlocks cs={cs} /> : null}

      <div className="markdown-body" style={{ maxWidth: 720, margin: '0 auto' }}>
        {markdown}
      </div>

      <RelatedPosts currentId={article.id} currentTags={article.tags} all={all} />

      <div
        style={{
          marginTop: 80,
          paddingTop: 32,
          borderTop: '1px solid var(--hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <button type="button" className="btn" onClick={() => router.push('/production')}>
          ← Production 一覧に戻る
        </button>
        <span className="t-meta">— 了 —</span>
      </div>
    </article>
  );
}

function KindBadge({ isCaseStudy }: { isCaseStudy: boolean }) {
  const label = isCaseStudy ? 'ケーススタディ' : 'ノート';
  const style: CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: 10,
    letterSpacing: '0.12em',
    fontFamily: 'var(--font-mincho)',
    border: '1px solid var(--hairline-strong)',
    background: isCaseStudy ? 'var(--fg)' : 'transparent',
    color: isCaseStudy ? 'var(--bg)' : 'var(--fg-muted)',
  };
  return (
    <span style={style} aria-label={`種別: ${label}`}>
      {label}
    </span>
  );
}

// 問・工・果 (problem / approach / result) ブロック
// 章タイトルを縦書きで配置し、各セクション本文を横に並べる。
// 章境界は <section> + aria-label でセマンティクスを担保。
function CaseStudyBlocks({ cs }: { cs: CaseStudy }) {
  const sections: Array<{ kanji: string; label: string; body: string }> = [
    { kanji: '問', label: '問 · Problem', body: cs.problem },
    { kanji: '工', label: '工 · Approach', body: cs.approach },
    { kanji: '果', label: '果 · Result', body: cs.result },
  ];

  return (
    <section
      aria-label="ケーススタディ: 問・工・果"
      style={{
        maxWidth: 720,
        margin: '0 auto 56px',
        padding: '24px 0',
        borderTop: '1px solid var(--hairline)',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {sections.map((s) => (
        <div
          key={s.kanji}
          style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <Tategaki
            upright
            mobileHorizontal={false}
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 28,
              lineHeight: 1.2,
              letterSpacing: '0.1em',
              color: 'var(--fg)',
            }}
          >
            {s.kanji}
          </Tategaki>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>
              {s.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: 16,
                lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
              }}
            >
              {s.body}
            </div>
          </div>
        </div>
      ))}

      {cs.metrics.length > 0 ? (
        <dl
          aria-label="ケーススタディの定量指標"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
            margin: 0,
            padding: '16px 0 0',
            borderTop: '1px dashed var(--hairline)',
          }}
        >
          {cs.metrics.map((m) => (
            <div key={`${m.label}:${m.value}`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <dt className="t-eyebrow" style={{ fontSize: 10 }}>
                {m.label}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mincho)',
                  fontSize: 22,
                  lineHeight: 1.3,
                }}
              >
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {cs.links.length > 0 ? (
        <ul
          aria-label="ケーススタディの参照リンク"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {cs.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mincho)',
                  fontSize: 14,
                  color: 'var(--fg)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                <span style={{ opacity: 0.5, marginRight: 6 }}>→</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
