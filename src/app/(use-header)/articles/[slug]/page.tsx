import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TagList from '@/app/_components/design/Tags';
import ArticleBody from './_components/ArticleBody';
import { articleSchema, type Article } from '@/lib/schemas/article';
import articlesData from '../../../../../data/articles.json';

// data ソースは repositories barrel ではなく data/articles.json を静的 import で取り込み、
// articleSchema で validation する (node:fs を edge bundle から排除する目的)。
//
// runtime は Phase 2 で 'edge' に明示移行予定 (#28 レビュー応答):
// 1) `src/app/layout.tsx` が `profileRepo` 経由で repositories barrel に依存
//    (layout 経由で node:fs が edge bundle に混入する)。
// 2) `ArticleBody` が `react-markdown` を SSR で利用 → edge ssr entry で
//    useState/useEffect の import 解決に失敗する。
// 3) Next.js 15 は `runtime='edge'` と `generateStaticParams` の併用を許可しない
//    (build error)。SSG は維持するため、runtime 指定は default のまま。
// 上記は admin Phase の barrel rework + markdown client island 化と合わせて解消する。
export const revalidate = 3600;

function getArticles(): Article[] {
  return articleSchema.array().parse(articlesData);
}

function findBySlug(slug: string): Article | null {
  return getArticles().find((a) => a.slug === slug) ?? null;
}

// SSG 化: data/articles.json から slug 一覧を build 時に生成し、
// 各記事ページを静的アセットとして CF Pages に配信させる (edge runtime 不要)。
export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findBySlug(slug);
  if (article == null) {
    return {
      title: '記事が見つかりません',
      alternates: { canonical: `/articles/${slug}` },
    };
  }
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findBySlug(slug);
  if (article == null) {
    notFound();
  }

  return (
    <article
      className="page-enter container"
      style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 1080 }}
    >
      <header style={{ marginBottom: 48 }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>
          {article.publishedAt} · ARTICLE
        </div>
        <h1
          className="t-h1"
          style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 16 }}
        >
          {article.title}
        </h1>
        {article.summary !== '' && (
          <div
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 22,
              color: 'var(--fg-muted)',
              marginBottom: 24,
            }}
          >
            {article.summary}
          </div>
        )}
        <TagList tags={article.tags} solid />
      </header>

      <ArticleBody content={article.body} />
    </article>
  );
}
