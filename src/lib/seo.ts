// 公開ページの canonical / og:url を組み立てる metadata helper。
//
// - URL はサイト相対パスで返し、絶対化は root layout の `metadataBase`
//   (= NEXT_PUBLIC_SITE_URL) に任せる。ドメインはここでハードコードしない。
// - Next.js の metadata merge は `alternates` / `openGraph` をキー単位で丸ごと
//   置き換える (浅いマージ)。page で openGraph を指定すると root layout の
//   siteName / locale / type と、root の file convention (src/app/opengraph-image.tsx)
//   由来の og:image が落ちるため、ここで既定値を補ってから返す。
// - edge runtime 互換: Node API を import しない純関数のみ。

import type { Metadata } from 'next';

type OpenGraph = NonNullable<Metadata['openGraph']>;

export const SITE_NAME = 'west · Portfolio';

/** hreflang (root layout / "/" / /en で共有) */
export const HREFLANG_LANGUAGES = {
  ja: '/',
  en: '/en',
  'x-default': '/',
} as const;

/** root layout と各ページで共有する openGraph 既定値 */
export const BASE_OPEN_GRAPH = {
  type: 'website',
  siteName: SITE_NAME,
  locale: 'ja_JP',
} as const satisfies OpenGraph;

// src/app/opengraph-image.tsx (サイト既定 OG 画像) の route と export (alt / size /
// contentType) に合わせる。page 側で openGraph を指定すると file convention の
// og:image が継承されないため、明示的に同じ画像を指す。
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: '西尾匡生 (west) — Web開発・業務自動化の受託 | 情報系学生エンジニア',
} as const;

/**
 * canonical 用にパスを正規化する。
 * - クエリ / ハッシュを除去
 * - 先頭スラッシュを保証、連続スラッシュを 1 つに
 * - 末尾スラッシュを除去 (ルート `/` は除く。sitemap.ts の URL 形式と一致)
 */
export function canonicalPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] ?? '';
  const collapsed = `/${pathname}`.replace(/\/{2,}/g, '/');
  if (collapsed === '/') return '/';
  return collapsed.replace(/\/+$/, '');
}

export interface PageMetadataOptions {
  /** ページ固有の openGraph (title / type / locale 等)。url は常に canonical で上書き */
  openGraph?: OpenGraph;
  /**
   * サイト既定の OG 画像 (DEFAULT_OG_IMAGE) を明示するか (既定 true)。
   * 同じ segment に opengraph-image ファイルを持つ route (production/[id] 等) では
   * false にして file convention 側の画像を優先させる。
   */
  defaultOgImage?: boolean;
}

/**
 * 公開ページ用の `alternates.canonical` と `openGraph.url` を同じ URL で返す。
 * 各 page の `metadata` / `generateMetadata` に spread して使う。
 */
export function pageMetadata(
  path: string,
  { openGraph, defaultOgImage = true }: PageMetadataOptions = {},
): Pick<Metadata, 'alternates' | 'openGraph'> {
  const url = canonicalPath(path);
  return {
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      ...(defaultOgImage ? { images: [DEFAULT_OG_IMAGE] } : {}),
      ...openGraph,
      url,
    } as OpenGraph,
  };
}
