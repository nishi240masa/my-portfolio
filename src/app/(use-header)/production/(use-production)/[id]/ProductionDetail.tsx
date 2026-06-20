'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import { LoadingDots } from '@/app/_components/design/States';
import RelatedPosts from './_components/RelatedPosts';
import type { Post, PostPage } from '@/types/post';

const MarkdownContent = dynamic(() => import('./MarkdownContent'), {
  ssr: false,
  loading: () => <LoadingDots />,
});

export default function ProductionDetail({ article, all }: { article: PostPage; all: Post[] }) {
  const router = useRouter();

  const meta = [
    { label: 'ROLE · 役割', value: article.role },
    { label: 'TEAM · 人数', value: `${article.peopleNum}名` },
    { label: 'PERIOD · 期間', value: article.period },
    { label: 'STACK · 使用技術', value: article.technologys.join(' / ') },
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
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>
          {article.date} · WORK
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

      <div className="markdown-body" style={{ maxWidth: 720, margin: '0 auto' }}>
        <MarkdownContent content={article.content} />
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
