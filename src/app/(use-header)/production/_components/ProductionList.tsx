'use client';

import { useMemo, useState } from 'react';
import ProductionCard from './ProductionCard';
import { EmptyState } from '@/app/_components/design/States';
import type { Post } from '@/types/post';

/**
 * Production 一覧のロジックコンポーネント
 * データは親の Server Component から props で受け取る
 */
export default function ProductionList({ data }: { data: Post[] }) {
  const [filter, setFilter] = useState('ALL');

  const allTags = useMemo(() => {
    return Array.from(new Set(data.flatMap((p) => p.tags)));
  }, [data]);

  const filtered = filter === 'ALL' ? data : data.filter((p) => p.tags.includes(filter));

  return (
    <>
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
