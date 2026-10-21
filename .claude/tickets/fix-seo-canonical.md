# fix-seo-canonical

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `fix/seo-canonical`
- **base**: `develop`
- **PR title**: `fix(seo): 全公開ページに canonical URL を出力`
- **依存**: なし
- **想定 reviewer 観点**: 各ページの canonical が自ページの絶対 URL (https://w3st.net/...) か / 動的ルート / 既存 metadata 破壊なし

## 背景

本番 `https://w3st.net/` の HTML に `<link rel="canonical">` が無い (2026-10-22 確認。`og:url` も未確認)。
`*.west-portfolio.pages.dev` の preview / deployment URL でも同じ内容が配信されるため、canonical で正規 URL を明示したい
(preview は CF が `X-Robots-Tag: noindex` を付与済み)。

## ゴール

全公開ページ (/, /home, /services, /contact, /articles, /articles/[slug], /production(s)/..., /profile, /skill, /journal 等の実在ルート) で
`<link rel="canonical" href="https://w3st.net/<path>">` を出す。`NEXT_PUBLIC_SITE_URL` (既存の `metadataBase` / `resolveSiteUrl()`) を SSOT に使い、ハードコードしない。
admin 系 (`/admin/**`) は対象外 (noindex 済みか確認し、未設定なら robots noindex を付与)。

## 進め方

- Next.js Metadata API の `alternates.canonical` を使う。root layout の `metadataBase` が設定済みなら各ページで相対パス指定で足りる。
- 動的ルートは `generateMetadata` で slug から組み立てる。
- trailing slash / クエリの扱いを統一 (sitemap.xml の URL と一致させる)。
- `og:url` も同じ URL になっているか確認し、ズレていれば揃える。

## 変更ファイル

- `src/app/**/page.tsx` / `layout.tsx` の metadata (最小限)
- 必要なら metadata 用 helper (既存の SEO helper があればそれを拡張)
- テスト: 既存のテスト構成に合わせて canonical の生成ロジックを単体テスト、または e2e smoke に canonical 検証を追加
- `.claude/tickets/fix-seo-canonical.md` (本ファイル)

## 禁止事項

- package.json / yarn.lock / wrangler.toml / workflow の変更
- 文言・デザイン変更

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build
```
PR の Preview URL で主要ページの canonical を curl で確認し PR 本文に記載。
