import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProductionByIdCached,
  getProfileCached,
  listProductionsCached,
  listProductionsSummaryCached,
} from '@/lib/repositories';
import { creativeWorkJsonLd, serializeJsonLd } from '@/lib/jsonld';
import MarkdownContent from './MarkdownContent';
import ProductionDetail from './ProductionDetail';

// 本ページは `generateStaticParams` で完全 SSG 化されており、Next.js 15 の制約上
// `export const runtime = 'edge'` と `generateStaticParams` を併用できない
// (build error: "cannot use both ...edge... and export generateStaticParams")。
// SSG された static asset は CF Pages 上で edge runtime を必要としないため、
// runtime 指定は省略し default のままにする (CF Pages 互換性は SSG により担保)。
// profile 取得は edge 互換の `getProfileCached` (async factory + lazy import)
// を使うことで、barrel 経由でも json driver の静的 dep を引き込まない。
export const revalidate = 60;

export async function generateStaticParams() {
  const items = await listProductionsCached();
  return items.map((item) => ({ id: String(item.id) }));
}

// PR #17 で opengraph-image.tsx の generateImageMetadata が alt を動的化したが、
// Twitter Card は file-based opengraph-image の alt を継承しないため、
// generateMetadata 側で openGraph.images / twitter.images を明示し、
// alt を `${article.title} のカバー画像` で揃える (a11y / SEO 整合)。
// metadataBase は app/layout.tsx で設定済みなので、images.url は相対 path で OK。
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getProductionByIdCached(Number(id));
  if (article == null) {
    return {
      title: '作品が見つかりません',
      alternates: { canonical: `/production/${id}` },
    };
  }
  const ogImageUrl = `/production/${article.id}/opengraph-image`;
  const alt = `${article.title} のカバー画像`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/production/${article.id}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [{ url: ogImageUrl, alt }],
    },
  };
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
  // author は getProfileCached() から自動補完する (jsonld helper に profile を渡す)。
  let articleJsonLd: ReturnType<typeof creativeWorkJsonLd> | null = null;
  if (article.caseStudy != null) {
    const profile = await getProfileCached();
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
