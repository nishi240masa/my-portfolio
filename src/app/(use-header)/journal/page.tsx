import type { Metadata } from 'next';
import SectionHeader from '@/app/_components/design/SectionHeader';
import { SubSection } from '@/app/_components/design/SectionHeader';
import { EmptyState } from '@/app/_components/design/States';
import JournalCard from './_components/JournalCard';
import { feedsSchema, type Feeds, type FeedItem } from '@/lib/schemas/feeds';
import feedsData from '../../../../data/feeds.json';

// data ソースは node:fs ではなく data/feeds.json を静的 import で取り込み、
// feedsSchema で validation する。
//
// runtime は Phase 2 で 'edge' に明示移行予定 (#28 レビュー応答):
// `src/app/layout.tsx` が `profileRepo` 経由で repositories barrel に依存し、
// 子ページに 'edge' を明示すると layout 経由で node:fs が edge bundle に混入するため、
// layout.tsx と repositories barrel の rework と合わせて edge 化する。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: '外部活動',
  description: 'Zenn / Qiita / GitHub 等の外部プラットフォームでの活動スナップショット。',
  alternates: { canonical: '/journal' },
};

function loadFeeds(): Feeds {
  try {
    return feedsSchema.parse(feedsData);
  } catch {
    return { zenn: [], qiita: [], github: [], updatedAt: null };
  }
}

function Section({
  eyebrow,
  title,
  items,
  empty,
}: {
  eyebrow: string;
  title: string;
  items: FeedItem[];
  empty: string;
}) {
  return (
    <div style={{ marginBottom: 56 }}>
      <SubSection eyebrow={eyebrow} title={title} />
      {items.length === 0 ? (
        <EmptyState title={empty} subtitle="Snapshot is being prepared." />
      ) : (
        <div className="production-grid">
          {items.map((item, i) => (
            <JournalCard key={`${item.source}-${item.url}-${i}`} data={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function Page() {
  const feeds = loadFeeds();
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="JOURNAL · 外部活動" title="外でも、書く。" kanji="外" />
      <div className="t-meta" style={{ marginBottom: 32 }}>
        UPDATED · {feeds.updatedAt ?? '—'}
      </div>
      <Section
        eyebrow="ZENN"
        title="Zenn"
        items={feeds.zenn}
        empty="Zenn の記事はまだありません"
      />
      <Section
        eyebrow="QIITA"
        title="Qiita"
        items={feeds.qiita}
        empty="Qiita の記事はまだありません"
      />
      <Section
        eyebrow="GITHUB"
        title="GitHub"
        items={feeds.github}
        empty="GitHub の活動はまだ取得されていません"
      />
    </section>
  );
}
