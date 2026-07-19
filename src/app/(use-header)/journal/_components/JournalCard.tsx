import type { FeedItem } from '@/lib/schemas/feeds';

interface Props {
  data: FeedItem;
  index: number;
}

/** 外部サービス (Zenn / Qiita / GitHub) のフィード 1 件を描画するカード */
export default function JournalCard({ data, index }: Props) {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
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
          {data.source.toUpperCase()}
          {data.publishedAt != null && data.publishedAt !== '' ? ` · ${data.publishedAt.slice(0, 10)}` : ''}
        </div>
        <h3 className="t-h3" style={{ fontSize: 20, marginBottom: 8 }}>
          {data.title}
        </h3>
        {data.summary != null && data.summary !== '' && (
          <div
            className="t-body"
            style={{
              fontSize: 13,
              color: 'var(--fg-muted)',
            }}
          >
            {data.summary}
          </div>
        )}
      </div>
    </a>
  );
}
