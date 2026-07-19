'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProductionCard from './ProductionCard';
import { EmptyState } from '@/app/_components/design/States';
import type { Post } from '@/types/post';

const ALL = 'ALL';

/**
 * Production 一覧のロジックコンポーネント
 * データは親の Server Component から props で受け取る。
 * tag フィルタは URLSearchParams (?tag=...) と同期する。
 */
export default function ProductionList({ data }: { data: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allTags = useMemo(() => {
    return Array.from(new Set(data.flatMap((p) => p.tags)));
  }, [data]);

  // URL の ?tag= を初期状態として読む。allTags に含まれないものは無視する。
  const tagFromUrl = searchParams?.get('tag') ?? null;
  const initialFilter =
    tagFromUrl != null && tagFromUrl !== '' && allTags.includes(tagFromUrl)
      ? tagFromUrl
      : ALL;

  const [filter, setFilter] = useState<string>(initialFilter);
  // aria-live で読み上げるメッセージ。初期表示時は空、フィルタ操作後に件数文字列を入れる。
  const [liveMessage, setLiveMessage] = useState<string>('');

  // URL が外部から変わった場合（戻る/進む等）に state を同期する
  useEffect(() => {
    const next =
      tagFromUrl != null && tagFromUrl !== '' && allTags.includes(tagFromUrl)
        ? tagFromUrl
        : ALL;
    setFilter((prev) => (prev === next ? prev : next));
  }, [tagFromUrl, allTags]);

  const updateUrl = useCallback(
    (nextFilter: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      if (nextFilter === ALL) {
        params.delete('tag');
      } else {
        params.set('tag', nextFilter);
      }
      const query = params.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      // 履歴を残さず URL のみ同期 (フィルタは UI 状態であり、戻る/進むで全件に戻る方が直感的)
      router.replace(next, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered =
    filter === ALL ? data : data.filter((p) => p.tags.includes(filter));

  const handleSelect = useCallback(
    (next: string) => {
      setFilter(next);
      updateUrl(next);
      const nextFiltered =
        next === ALL ? data : data.filter((p) => p.tags.includes(next));
      setLiveMessage(
        next === ALL
          ? `全 ${nextFiltered.length} 件を表示中`
          : `「${next}」で絞り込み — ${nextFiltered.length} 件`,
      );
    },
    [updateUrl, data],
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
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
          onClick={() => handleSelect(ALL)}
          aria-current={filter === ALL ? 'true' : undefined}
          aria-controls="production-list-results"
          className={'tag' + (filter === ALL ? ' solid' : '')}
          style={{ cursor: 'pointer', border: filter === ALL ? '1px solid var(--primary)' : undefined }}
        >
          ALL · 全て
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleSelect(t)}
            aria-current={filter === t ? 'true' : undefined}
            aria-controls="production-list-results"
            className={'tag' + (filter === t ? ' solid' : '')}
            style={{ cursor: 'pointer', border: filter === t ? '1px solid var(--primary)' : undefined }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="t-meta"
        style={{ marginBottom: 24, fontSize: 12, color: 'var(--fg-muted)' }}
      >
        {liveMessage}
      </div>

      <div id="production-list-results">
        {filtered.length === 0 ? (
          <EmptyState title="該当する作品がありません" subtitle="Try another filter." />
        ) : (
          <div className="production-grid">
            {filtered.map((data, i) => (
              <ProductionCard key={data.id} data={data} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
