import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import SectionHeader from '@/app/_components/design/SectionHeader';
import { SubSection } from '@/app/_components/design/SectionHeader';
import { EmptyState } from '@/app/_components/design/States';
import JournalCard from './_components/JournalCard';
import { feedsSchema, type Feeds, type FeedItem } from '@/lib/schemas/feeds';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '外部活動',
  description: 'Zenn / Qiita / GitHub 等の外部プラットフォームでの活動スナップショット。',
  alternates: { canonical: '/journal' },
};

async function loadFeeds(): Promise<Feeds> {
  const filePath = path.join(process.cwd(), 'data', 'feeds.json');
  try {
    const text = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(text) as unknown;
    return feedsSchema.parse(json);
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
  const feeds = await loadFeeds();
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
