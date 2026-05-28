'use client';

import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

/**
 * Markdown 本文レンダラ。
 * rehype-katex は DOMParser 等のブラウザ API に依存する isomorphic モジュールを
 * 取り込むため、edge ランタイムの SSR では評価できない。
 * このコンポーネントは detail ページから dynamic(ssr:false) で読み込み、
 * クライアント側でのみ評価されるようにしている。
 */
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {content}
    </ReactMarkdown>
  );
}
