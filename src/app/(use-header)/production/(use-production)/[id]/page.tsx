import { notFound } from 'next/navigation';
import {
  getProductionByIdCached,
  listProductionsCached,
  listProductionsSummaryCached,
  profileRepo,
} from '@/lib/repositories';
import { creativeWorkJsonLd, serializeJsonLd } from '@/lib/jsonld';
import MarkdownContent from './MarkdownContent';
import ProductionDetail from './ProductionDetail';

// 本ページは `generateStaticParams` で完全 SSG 化されており、Next.js 15 の制約上
// `export const runtime = 'edge'` と `generateStaticParams` を併用できない
// (build error: "cannot use both ...edge... and export generateStaticParams")。
// SSG された static asset は CF Pages 上で edge runtime を必要としないため、
// runtime 指定は省略し default のままにする (CF Pages 互換性は SSG により担保)。
// `profileRepo` は `@/lib/repositories` barrel 経由で import されているが、
// SSG (build 時 fs アクセス) のため node:fs は edge bundle に乗らない。
export const revalidate = 60;

export async function generateStaticParams() {
  const items = await listProductionsCached();
  return items.map((item) => ({ id: String(item.id) }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, all] = await Promise.all([
    getProductionByIdCached(Number(id)),
    listProductionsSummaryCached(),
  ]);
  if (article == null) {
    notFound();
  }

  // caseStudy 定義時のみ Article 型 JSON-LD を出力する。
  // author は profileRepo.get() から自動補完する (jsonld helper に profile を渡す)。
  let articleJsonLd: ReturnType<typeof creativeWorkJsonLd> | null = null;
  if (article.caseStudy != null) {
    const profile = await profileRepo.get();
    articleJsonLd = creativeWorkJsonLd(article, { type: 'Article', profile });
  }

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          // serializeJsonLd で `<`/`>`/`&` をエスケープし、</script> 経由の XSS を防ぐ。
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
        />
      ) : null}
      <ProductionDetail
        article={article}
        all={all}
        markdown={<MarkdownContent content={article.content} />}
      />
    </>
  );
}
