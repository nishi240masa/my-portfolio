import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { HREFLANG_LANGUAGES, pageMetadata } from '@/lib/seo';

// "/" は "/home" へのリダイレクト専用。静的 prerender 時は 200 + meta refresh で
// 配信されるため、canonical / og:url を正規ページ (/home) に向ける。
// root layout の hreflang (alternates.languages) は "/" に残す
// (alternates はキー単位で置き換わるため明示的に引き継ぐ)。
const seo = pageMetadata('/home');

export const metadata: Metadata = {
  ...seo,
  alternates: {
    ...seo.alternates,
    languages: HREFLANG_LANGUAGES,
  },
};

/**
 * ルート "/" へのアクセスは "/home" へリダイレクト
 * ヘッダー付きレイアウトグループ (use-header) が適用されます
 */
export default function RootPage() {
  redirect('/home');
}
