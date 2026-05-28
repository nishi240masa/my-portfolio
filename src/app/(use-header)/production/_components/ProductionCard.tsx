import Link from 'next/link';
import { type Post } from '@/types/post';
import { ImagePlaceholder } from '@/app/_components/design/Placeholders';
import TagList from '@/app/_components/design/Tags';

interface Props {
  data: Post;
  index: number;
}

export default function ProductionCard({ data, index }: Props) {
  return (
    <Link
      href={`/production/${data.id}`}
      className="card"
      style={{
        textDecoration: 'none',
        background: 'var(--bg-elev)',
        color: 'inherit',
        display: 'block',
        animation: `fadeIn .6s ${index * 0.06}s both`,
      }}
    >
      <div style={{ position: 'relative' }}>
        <ImagePlaceholder label={`PROJECT IMAGE · ${data.title}`} ratio="16/10" src={data.image} />
        <span
          className="t-meta"
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'color-mix(in oklab, var(--bg-elev) 92%, transparent)',
            padding: '4px 10px',
          }}
        >
          {data.date}
        </span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <h3 className="t-h3" style={{ fontSize: 22 }}>
            {data.title}
          </h3>
          <span className="t-meta" style={{ fontSize: 10 }}>
            NO.{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="t-body" style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16, minHeight: 36 }}>
          {data.description}
        </div>
        <TagList tags={data.tags.slice(0, 4)} />
      </div>
    </Link>
  );
}
