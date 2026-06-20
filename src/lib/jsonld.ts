// Schema.org 構造化データ（JSON-LD）生成ヘルパ
// Person / CreativeWork(Article) を最小限のフィールドで返す。
//
// SEO/SNSシェア体験を強化するため、layout.tsx や 詳細ページ に
// <script type="application/ld+json"> として埋め込んで使用する。

import type { Profile } from '@/types/profile';
import type { PostPage } from '@/types/post';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url: string;
  jobTitle?: string;
  sameAs?: string[];
  image?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressCountry?: string;
  };
}

export interface CreativeWorkJsonLd {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork' | 'Article';
  headline: string;
  dateCreated?: string;
  datePublished?: string;
  author?: {
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
  const base = SITE_URL.replace(/\/+$/, '');
  const path = maybeRelative.startsWith('/') ? maybeRelative : `/${maybeRelative}`;
  return `${base}${path}`;
}

/**
 * Profile から Schema.org Person オブジェクトを生成する。
 *
 * - `sameAs` は profile.sns の url から非空のものを抽出
 * - `image` は portraitSrc を絶対URL化
 * - `address` は headline から国情報を推測せず、明示が無い限り省略
 */
export function personJsonLd(profile: Profile): PersonJsonLd {
  const sameAs = profile.sns
    .map((s) => s.url)
    .filter((u): u is string => typeof u === 'string' && u.length > 0 && !u.startsWith('mailto:'));

  const ld: PersonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.nameEn || profile.nameJp,
    url: SITE_URL,
  };

  if (profile.headline) {
    ld.jobTitle = profile.headline;
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
 */
export function creativeWorkJsonLd(
  post: PostPage,
  options?: { author?: { name: string; url?: string }; type?: 'CreativeWork' | 'Article' },
): CreativeWorkJsonLd {
  const type = options?.type ?? 'CreativeWork';
  const ld: CreativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: post.title,
  };

  if (post.date) {
    ld.dateCreated = post.date;
    ld.datePublished = post.date;
  }
  if (options?.author?.name) {
    ld.author = {
      '@type': 'Person',
      name: options.author.name,
      ...(options.author.url ? { url: options.author.url } : {}),
    };
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
