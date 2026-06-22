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

// PR #17 で opengraph-image.tsx の generateImageMetadata が alt を動的に title 含むよう
// 設定済。Next.js は file-based opengraph-image を auto-discover し、og:image / twitter:image
// 両方を generateImageMetadata の alt 付きで埋める。よってここでは images を明示しない
// (明示するとハッシュ付きの実 route と URL が不一致になり 404 / SEO 破綻)。
// title / description / canonical / og:type='article' / twitter:card のみ動的化する。
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
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/production/${article.id}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
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
