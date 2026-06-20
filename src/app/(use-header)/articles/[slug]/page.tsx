import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleRepo } from '@/lib/repositories';
import TagList from '@/app/_components/design/Tags';
import ArticleBody from './_components/ArticleBody';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleRepo.getBySlug(slug);
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
  const article = await articleRepo.getBySlug(slug);
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
