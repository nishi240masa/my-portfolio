import type { Metadata } from 'next';
import SectionHeader from '@/app/_components/design/SectionHeader';
import ArticleList from './_components/ArticleList';
import { articleRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '記事',
  description: '西尾 匡生のオリジナル記事一覧。',
  alternates: { canonical: '/articles' },
};

export default async function Page() {
  const data = await articleRepo.list();
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <SectionHeader eyebrow="ARTICLES · 記事" title="書いたもの。" kanji="筆" />
      <ArticleList data={data} />
    </section>
  );
}
