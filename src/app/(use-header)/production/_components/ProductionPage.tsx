import { Suspense } from 'react';
import SectionHeader from '@/app/_components/design/SectionHeader';
import ProductionList from './ProductionList';
import type { Post } from '@/types/post';

export default function ProductionPage({ data }: { data: Post[] }) {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="PRODUCTION · 作品集" title="つくったもの。" kanji="作" />
      <Suspense fallback={<div>読み込み中...</div>}>
        <ProductionList data={data} />
      </Suspense>
    </section>
  );
}
