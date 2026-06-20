import Link from 'next/link';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';
import type { Post } from '@/types/post';

/**
 * RelatedPosts
 * 現在の Production と tag を共有する他の Production を最大3件表示する。
 * 表示順は同じ tag を多く共有するもの優先、その次に日付降順。
 */
export default function RelatedPosts({
  currentId,
  currentTags,
  all,
  max = 3,
}: {
  currentId: number;
  currentTags: string[];
  all: Post[];
  max?: number;
}) {
  const tagSet = new Set(currentTags);

  const related = all
    .filter((p) => p.id !== currentId && p.tags.some((t) => tagSet.has(t)))
    .map((p) => ({
      post: p,
      overlap: p.tags.reduce((acc, t) => (tagSet.has(t) ? acc + 1 : acc), 0),
    }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      // 日付降順（文字列比較で十分: "YYYY-MM-DD" / "YYYY.MM" 等を許容）
      return (b.post.date ?? '').localeCompare(a.post.date ?? '');
    })
    .slice(0, max)
    .map((x) => x.post);

  if (related.length === 0) return null;

  return (
    <section
      aria-label="関連作品"
      style={{
        marginTop: 80,
        paddingTop: 32,
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <span
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 30,
            color: 'var(--primary)',
            lineHeight: 1,
          }}
        >
          縁
        </span>
        <div>
          <div className="t-eyebrow">RELATED · 関連作品</div>
          <h2 className="t-h3" style={{ fontSize: 22, marginTop: 4 }}>
            同じ系譜の作品
          </h2>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}
      >
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/production/${p.id}`}
            className="card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--bg-elev)',
              display: 'block',
            }}
          >
            <ImagePlaceholder label={`PROJECT IMAGE · ${p.title}`} ratio="16/10" src={p.image} />
            <div style={{ padding: 16 }}>
              <div className="t-meta" style={{ fontSize: 10, marginBottom: 4 }}>
                {p.date}
              </div>
              <h3 className="t-h3" style={{ fontSize: 16, marginBottom: 8 }}>
                {p.title}
              </h3>
              <TagList tags={p.tags.slice(0, 3)} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
