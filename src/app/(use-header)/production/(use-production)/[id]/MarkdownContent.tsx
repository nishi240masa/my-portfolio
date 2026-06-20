import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

/**
 * Markdown 本文レンダラ (Server Component)。
 * react-markdown / remark-gfm / remark-math / rehype-katex はいずれも
 * Node ランタイム上で SSR 可能なため、サーバー側で評価して静的化する。
 * (Edge ランタイムでは rehype-katex の依存が問題になるが、当ページは
 * runtime = 'nodejs' を指定しているため問題ない)
 */
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {content}
    </ReactMarkdown>
  );
}
