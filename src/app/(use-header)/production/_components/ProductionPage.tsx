import SectionHeader from '@/app/_components/design/SectionHeader';
import ProductionList from './ProductionList';

export default function ProductionPage() {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="PRODUCTION · 作品集" title="つくったもの。" kanji="作" />
      <ProductionList />
    </section>
  );
}
