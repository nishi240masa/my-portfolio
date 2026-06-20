import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * 記事本文 (Markdown) を表示する Server Component。
 *
 * /articles/[slug] は SEO/初期表示が重要なため、SSR で本文を描画する。
 * rehype-katex は DOMParser など SSR 不可な API を巻き込むため、ここでは
 * 数式拡張を外し、remark-gfm のみで標準 Markdown を SSR 描画する。
 * 数式が必要になった場合は別途 client island としてマウントする方針。
 */
export default function ArticleBody({ content }: { content: string }) {
  return (
    <div className="markdown-body" style={{ maxWidth: 720, margin: '0 auto' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
