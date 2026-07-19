import ProductionEditor from '../_components/ProductionEditor';

export const runtime = 'edge';

export default function NewProductionPage() {
  return (
    <div>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>
        PRODUCTIONS · 新規作成
      </div>
      <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 24 }}>新しい作品</h1>
      <ProductionEditor />
    </div>
  );
}
