'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductionRow({
  id,
  title,
  date,
  description,
  tags,
}: {
  id: number;
  title: string;
  date: string;
  description: string;
  tags: string[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/productions/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('削除に失敗しました');
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        padding: '20px 24px',
        borderBottom: '1px solid var(--hairline)',
        alignItems: 'center',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div className="t-meta" style={{ marginBottom: 4 }}>
          #{id} · {date}
        </div>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {description}
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.map((t) => (
            <span key={t} className="tag" style={{ fontSize: 10, padding: '3px 8px' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          href={`/admin/productions/${id}`}
          style={{
            padding: '8px 14px',
            fontSize: 12,
            fontFamily: 'var(--font-mincho)',
            border: '1px solid var(--hairline-strong)',
            background: 'transparent',
            color: 'var(--fg)',
            textDecoration: 'none',
          }}
        >
          編集
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '8px 14px',
            fontSize: 12,
            fontFamily: 'var(--font-mincho)',
            border: '1px solid #c33',
            background: 'transparent',
            color: '#c33',
            cursor: deleting ? 'not-allowed' : 'pointer',
            opacity: deleting ? 0.5 : 1,
          }}
        >
          {deleting ? '...' : '削除'}
        </button>
      </div>
    </div>
  );
}
