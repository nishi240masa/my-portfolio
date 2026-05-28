'use client';

import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createPostDetailAtom } from '@/store/postAtom';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import { LoadingDots, ErrorState } from '@/app/_components/design/States';

// KaTeX を含む Markdown レンダラはブラウザ API 依存のため、edge SSR を避けて
// クライアント側でのみ読み込む。
const MarkdownContent = dynamic(() => import('./MarkdownContent'), {
  ssr: false,
  loading: () => <LoadingDots />,
});

export const runtime = 'edge';

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const postDetailAtom = useMemo(
    () => loadable(createPostDetailAtom(typeof id === 'string' ? id : String(id))),
    [id],
  );
  const [articleState] = useAtom(postDetailAtom);

  if (articleState.state === 'loading') {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <LoadingDots />
      </div>
    );
  }

  const article = articleState.state === 'hasData' ? articleState.data : null;
  if (article == null) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <ErrorState message="該当の作品が見つかりませんでした。" />
        <div style={{ marginTop: 24 }}>
          <button type="button" className="btn" onClick={() => router.push('/production')}>
            ← Production 一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const meta = [
    { label: 'ROLE · 役割', value: article.role },
    { label: 'TEAM · 人数', value: `${article.peopleNum}名` },
    { label: 'PERIOD · 期間', value: article.period },
    { label: 'STACK · 使用技術', value: article.technologys.join(' / ') },
  ];

  return (
    <article className="page-enter container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 1080 }}>
      {/* 戻る */}
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

      {/* プロジェクトメタ */}
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

      {/* 本文 */}
      <div className="markdown-body" style={{ maxWidth: 720, margin: '0 auto' }}>
        <MarkdownContent content={article.content} />
      </div>

      {/* フッターナビ */}
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
