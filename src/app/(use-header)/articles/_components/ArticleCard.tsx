import Link from 'next/link';
import TagList from '@/app/_components/design/Tags';
import type { Article } from '@/lib/schemas/article';

interface Props {
  data: Article;
  index: number;
}

export default function ArticleCard({ data, index }: Props) {
  return (
    <Link
      href={`/articles/${data.slug}`}
      className="card"
      style={{
        textDecoration: 'none',
        background: 'var(--bg-elev)',
        color: 'inherit',
        display: 'block',
        animation: `fadeIn .6s ${index * 0.06}s both`,
      }}
    >
      <div style={{ padding: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>
          {data.publishedAt} · ARTICLE
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <h3 className="t-h3" style={{ fontSize: 22 }}>
            {data.title}
          </h3>
          <span className="t-meta" style={{ fontSize: 10 }}>
            NO.{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div
          className="t-body"
          style={{
            fontSize: 13,
            color: 'var(--fg-muted)',
            marginBottom: 16,
            minHeight: 36,
          }}
        >
          {data.summary}
        </div>
        <TagList tags={data.tags.slice(0, 4)} />
      </div>
    </Link>
  );
}
