'use client';

import dynamic from 'next/dynamic';
import { LoadingDots } from '@/app/_components/design/States';

const MarkdownContent = dynamic(
  () => import('@/app/(use-header)/production/(use-production)/[id]/MarkdownContent'),
  {
    ssr: false,
    loading: () => <LoadingDots />,
  },
);

/**
 * 記事本文 (Markdown) を表示するクライアントラッパ。
 * 既存 production 詳細と同じ MarkdownContent を共用し、
 * 同じ rehype-katex の SSR 制約を満たす。
 */
export default function ArticleBody({ content }: { content: string }) {
  return (
    <div className="markdown-body" style={{ maxWidth: 720, margin: '0 auto' }}>
      <MarkdownContent content={content} />
    </div>
  );
}
