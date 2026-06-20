import Link from 'next/link';
import { productionRepo } from '@/lib/repositories';
import ProductionRow from './_components/ProductionRow';

export const dynamic = 'force-dynamic';

export default async function ProductionsAdminPage() {
  const items = await productionRepo.list();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 6 }}>
            PRODUCTIONS · 作品一覧
          </div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 28 }}>作品の編集</h1>
        </div>
        <Link
          href="/admin/productions/new"
          style={{
            padding: '10px 20px',
            fontFamily: 'var(--font-mincho)',
            fontSize: 13,
            border: '1px solid var(--primary)',
            background: 'var(--primary)',
            color: 'var(--primary-on)',
            textDecoration: 'none',
          }}
        >
          + 新規作成
        </Link>
      </div>

      <div style={{ border: '1px solid var(--hairline)', background: 'var(--bg-elev)' }}>
        {items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--fg-muted)' }}>作品がありません</div>
        ) : (
          items.map((p) => (
            <ProductionRow key={p.id} id={p.id} title={p.title} date={p.date} description={p.description} tags={p.tags} />
          ))
        )}
      </div>
    </div>
  );
}
