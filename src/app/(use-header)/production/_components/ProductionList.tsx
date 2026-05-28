'use client';

import { useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import ProductionCard from './ProductionCard';
import { postsAtomLoadable } from '@/store/postAtom';
import { LoadingDots, EmptyState, ErrorState } from '@/app/_components/design/States';

/**
 * Production 一覧のロジックコンポーネント
 * データ取得・タグフィルタ・状態管理を担当し、ProductionCard に描画を委譲する
 */
export default function ProductionList() {
  const [articles] = useAtom(postsAtomLoadable);
  const [filter, setFilter] = useState('ALL');

  const allTags = useMemo(() => {
    if (articles.state !== 'hasData') return [];
    return Array.from(new Set(articles.data.flatMap((p) => p.tags)));
  }, [articles]);

  if (articles.state === 'loading') {
    return <LoadingDots />;
  }

  if (articles.state === 'hasError') {
    return <ErrorState message="データの取得に失敗しました。しばらくしてからもう一度お試しください。" />;
  }

  const filtered = filter === 'ALL' ? articles.data : articles.data.filter((p) => p.tags.includes(filter));

  return (
    <>
      {/* フィルタバー */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 40,
          paddingBottom: 24,
          borderBottom: '1px solid var(--hairline)',
          alignItems: 'center',
        }}
      >
        <span className="t-eyebrow" style={{ marginRight: 8 }}>
          FILTER ·
        </span>
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={'tag' + (filter === 'ALL' ? ' solid' : '')}
          style={{ cursor: 'pointer', border: filter === 'ALL' ? '1px solid var(--primary)' : undefined }}
        >
          ALL · 全て
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={'tag' + (filter === t ? ' solid' : '')}
            style={{ cursor: 'pointer', border: filter === t ? '1px solid var(--primary)' : undefined }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="該当する作品がありません" subtitle="Try another filter." />
      ) : (
        <div className="production-grid">
          {filtered.map((data, i) => (
            <ProductionCard key={data.id} data={data} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
