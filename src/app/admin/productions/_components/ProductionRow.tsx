'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteProduction } from '../../_actions/productions';

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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteProduction(id);
      if (!res.ok) {
        setError(res.error ?? '削除に失敗しました');
        return;
      }
      router.refresh();
    });
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
        {error ? (
          <div className="t-meta" style={{ marginTop: 6, color: '#c33' }}>
            ! {error}
          </div>
        ) : null}
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
          disabled={pending}
          style={{
            padding: '8px 14px',
            fontSize: 12,
            fontFamily: 'var(--font-mincho)',
            border: '1px solid #c33',
            background: 'transparent',
            color: '#c33',
            cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.5 : 1,
          }}
        >
          {pending ? '...' : '削除'}
        </button>
      </div>
    </div>
  );
}
