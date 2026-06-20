// Schema.org 構造化データ（JSON-LD）生成ヘルパ
// Person / CreativeWork(Article) を最小限のフィールドで返す。
//
// SEO/SNSシェア体験を強化するため、layout.tsx や 詳細ページ に
// <script type="application/ld+json"> として埋め込んで使用する。

import type { Profile } from '@/types/profile';
import type { PostPage } from '@/types/post';

// SITE_URL は環境変数 NEXT_PUBLIC_SITE_URL から取得する。
// production では未設定を許容しない（明示的に絶対URLを与える必要がある）が、
// import 時点で throw すると _not-found 等のエラーページのビルドまで巻き込むため、
// helper 関数呼び出し時に遅延評価する。
// dev では localhost にフォールバックして開発体験を損なわないようにする。
function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl != null && envUrl !== '') {
    return envUrl;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL is required in production for JSON-LD absolute URLs',
    );
  }
  return 'http://localhost:3000';
}

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  '@id': string;
  name: string;
  alternateName?: string;
  url: string;
  description?: string;
  sameAs?: string[];
  image?: string;
}

export interface CreativeWorkJsonLd {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork' | 'Article';
  '@id': string;
  headline: string;
  dateCreated?: string;
  datePublished?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  image?: string;
  keywords?: string[];
  url?: string;
}

// `url` を絶対URLに正規化する
function toAbsoluteUrl(maybeRelative: string | undefined): string | undefined {
  if (maybeRelative == null || maybeRelative === '') return undefined;
  if (/^https?:\/\//.test(maybeRelative) || /^mailto:/.test(maybeRelative)) {
    return maybeRelative;
  }
  const base = resolveSiteUrl().replace(/\/+$/, '');
  const path = maybeRelative.startsWith('/') ? maybeRelative : `/${maybeRelative}`;
  return `${base}${path}`;
}

/**
 * Profile から Schema.org Person オブジェクトを生成する。
 *
 * - `name` は日本語表記 (nameJp) を優先し、英字表記は `alternateName` に置く
 *   （Knowledge Graph で主表記として日本語を扱わせるため）
 * - `description` には profile.headline をマップする（jobTitle は職務肩書きを期待
 *   する固有プロパティのため、自由記述の headline には不適）
 * - `@id` を `${SITE_URL}/#person` 固定で付与し、他のノードからの参照を可能にする
 * - `sameAs` は profile.sns の url から非空のものを抽出
 * - `image` は portraitSrc を絶対URL化
 */
export function personJsonLd(profile: Profile): PersonJsonLd {
  const siteUrl = resolveSiteUrl();
  const base = siteUrl.replace(/\/+$/, '');
  const sameAs = profile.sns
    .map((s) => s.url)
    .filter((u): u is string => typeof u === 'string' && u.length > 0 && !u.startsWith('mailto:'));

  const ld: PersonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${base}/#person`,
    name: profile.nameJp || profile.nameEn,
    url: siteUrl,
  };

  if (profile.nameEn && profile.nameEn !== ld.name) {
    ld.alternateName = profile.nameEn;
  }
  if (profile.headline) {
    ld.description = profile.headline;
  }
  if (sameAs.length > 0) {
    ld.sameAs = sameAs;
  }
  const image = toAbsoluteUrl(profile.portraitSrc);
  if (image != null) {
    ld.image = image;
  }
  return ld;
}

/**
 * Post (作品/詳細) から Schema.org CreativeWork (Article 派生) を生成する。
 *
 * - `headline` は post.title
 * - `dateCreated` / `datePublished` は post.date（YYYY-MM 等の文字列を許容）
 * - `keywords` は post.tags
 * - `image` は post.image を絶対URL化（未設定は省略）
 * - `@id` を `${SITE_URL}/production/${post.id}#creativework` で付与（Personと結合）
 *
 * author は必須。Article は author 不在を許容しないため、呼び出し側が
 * Profile から author を自動補完したい場合は `profile` を渡せばここで作る。
 */
export function creativeWorkJsonLd(
  post: PostPage,
  options: {
    author?: { name: string; url?: string };
    profile?: Profile;
    type?: 'CreativeWork' | 'Article';
  },
): CreativeWorkJsonLd {
  const type = options.type ?? 'CreativeWork';
  const base = resolveSiteUrl().replace(/\/+$/, '');

  // author 解決: 明示指定が最優先、無ければ profile から補完
  let author: CreativeWorkJsonLd['author'];
  if (options.author?.name) {
    author = {
      '@type': 'Person',
      name: options.author.name,
      ...(options.author.url ? { url: options.author.url } : {}),
    };
  } else if (options.profile != null) {
    const name = options.profile.nameJp || options.profile.nameEn;
    author = {
      '@type': 'Person',
      name,
      url: `${base}/#person`,
    };
  } else {
    throw new Error(
      'creativeWorkJsonLd requires either options.author or options.profile (author is mandatory for Article)',
    );
  }

  const ld: CreativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${base}/production/${post.id}#creativework`,
    headline: post.title,
    author,
  };

  if (post.date) {
    ld.dateCreated = post.date;
    ld.datePublished = post.date;
  }
  const image = toAbsoluteUrl(post.image);
  if (image != null) {
    ld.image = image;
  }
  if (post.tags.length > 0) {
    ld.keywords = post.tags;
  }
  const url = toAbsoluteUrl(`/production/${post.id}`);
  if (url != null) {
    ld.url = url;
  }
  return ld;
}
