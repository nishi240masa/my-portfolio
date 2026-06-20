import type { Metadata } from 'next';
import SectionHeader from '@/app/_components/design/SectionHeader';
import ArticleList from './_components/ArticleList';
import { articleSchema } from '@/lib/schemas/article';
import articlesData from '../../../../data/articles.json';

// data ソースは repositories barrel ではなく data/articles.json を静的 import で取り込み、
// articleSchema で validation する (node:fs を edge bundle から排除する目的)。
//
// runtime は Phase 2 で 'edge' に明示移行予定 (#28 レビュー応答):
// 現状 `src/app/layout.tsx` が `profileRepo` を経由して repositories barrel を
// 読み込むため、子ページに runtime='edge' を明示すると layout 経由で node:fs が
// edge bundle に混入し build が落ちる。layout.tsx と repositories barrel の
// rework (admin Phase / PR-B-admin-edge) と合わせて edge 化する。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: '記事',
  description: '西尾 匡生のオリジナル記事一覧。',
  alternates: { canonical: '/articles' },
};

export default async function Page() {
  const data = articleSchema.array().parse(articlesData);
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="ARTICLES · 記事" title="書いたもの。" kanji="筆" />
      <ArticleList data={data} />
    </section>
  );
}
