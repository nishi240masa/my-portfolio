# feat-og-alt-twitter-meta

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `feat/og-alt-twitter-meta`
- **base**: `develop`
- **PR title**: `feat(seo): OG image alt を Twitter Card メタにも動的反映`
- **依存**: PR #17 (OG画像のalt動的化) が develop に入っていること
- **想定 reviewer 観点**: SEO / A11y / Social card 検証

## ゴール

PR #17 で `opengraph-image.tsx` の `generateImageMetadata` の alt が動的に
タイトルを含むようになったが、Twitter Card 等のメタ側へその alt を反映していない。
`production/[id]/page.tsx` に `generateMetadata` を追加して、`openGraph.images` /
`twitter.images` の alt をタイトル動的に揃え、`opengraph-image.tsx` の
`generateImageMetadata` と整合させる。

## 変更ファイル (これ以外は触らない)

- `src/app/(use-header)/production/(use-production)/[id]/page.tsx` —
  `generateMetadata` を追加し、`openGraph.images` / `twitter.images` の alt を
  `${article.title} のカバー画像` で動的設定。`canonical` / `description` /
  `og:type='article'` も合わせて補完する。
- `.claude/tickets/feat-og-alt-twitter-meta.md` (新規) — 本 SSOT

## 禁止事項

- `src/app/(use-header)/production/(use-production)/[id]/opengraph-image.tsx` —
  画像本体・generateImageMetadata は #17 で完成しているため触らない。
- `src/lib/repositories/**` — 別 epic (admin barrel rework) のスコープ。
- `src/lib/jsonld.ts` — JSON-LD 出力は本 PR の責務外。
- `yarn.lock` — 依存追加なし。

## 実装ポイント

- `Metadata` 型を `next` から import。
- `getProductionByIdCached(Number(id))` で記事を取得。`null` の場合は
  `title: '作品が見つかりません'` + canonical だけ返して 404 ページの
  メタ汚染を防ぐ (Next.js の generateMetadata は notFound 時にも呼ばれ得る)。
- `metadataBase` は `src/app/layout.tsx` で設定済み (`NEXT_PUBLIC_SITE_URL` ベース)
  のため、`images.url` は相対 path `/production/${id}/opengraph-image` で十分。
- `alt` は `${article.title} のカバー画像` で `opengraph-image.tsx` の
  `generateImageMetadata` と完全一致させる。
- Twitter Card は file-based `opengraph-image` の alt を継承しないため、
  `twitter.images` を明示的に設定する必要がある (本 PR の本質)。
- `og:type='article'` も合わせて補完 (top-level metadata は website のため、
  詳細ページでは article に上書き)。
- `revalidate=60` / `generateStaticParams` は既存のまま (SSG 維持)。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
```

build 後の `.next/server/app/(use-header)/production/(use-production)/[id]/`
あるいはランタイム上の `<head>` で以下を確認:
- `<meta property="og:image" content=".../production/<id>/opengraph-image">`
- `<meta property="og:image:alt" content="<title> のカバー画像">`
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta name="twitter:image" content=".../production/<id>/opengraph-image">`
- `<meta name="twitter:image:alt" content="<title> のカバー画像">`

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "feat(seo): OG image alt を Twitter Card メタにも動的反映"
git push -u origin feat/og-alt-twitter-meta
gh pr create --base develop --head feat/og-alt-twitter-meta \
  --title "feat(seo): OG image alt を Twitter Card メタにも動的反映" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] `generateImageMetadata` (opengraph-image) と `generateMetadata` (page)
      の alt が完全一致しているか
- [ ] Twitter Card に image / image:alt が出ているか
- [ ] `opengraph-image.tsx` を触っていないこと (禁止事項)
- [ ] `revalidate` / `generateStaticParams` を壊していないこと
- [ ] notFound (article == null) 時のメタが安全か (404 ページ汚染回避)
- [ ] metadataBase に依存して相対 URL で動くか (SSR / build 両方で)
