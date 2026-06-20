# perf-cf-edge-public

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `perf/cf-edge-public`
- **base**: `develop`
- **PR title**: `perf(edge): 公開ページ静的化 + 静的 import 化で edge 互換性に近づける (CF Pages Phase 1)`
- **依存**: PR #5 (GitHub Contents API driver) / PR #9 (unstable_cache + ISR) / PR #19 (root layout の cookies() 局所化) — いずれも develop に merge 済
- **想定 reviewer 観点**: Performance / Cloudflare Pages 互換性 / アーキテクト

## ゴール

CF Pages PR preview ビルドを通すための **Phase 1**。
公開ページを最大限 **静的化 (SSG/Static)** することで、CF Pages 上では静的アセット配信となり
Edge ランタイム指定を必要としない構成に持ち込む。
動的 OG 画像 (`production/[id]/opengraph-image`) は `dynamic = 'force-static'` で静的化されるため
`runtime = 'nodejs'` のまま据え置き。
admin の Edge 化と root layout の barrel 切り離しは別 PR (PR-B-admin-edge) で対応。

## 背景

`docs/CLOUDFLARE_PAGES_SETUP.md` と `docs/PROGRESS.md` の通り、
admin が `src/lib/repositories/json/jsonFile.ts` 経由で `node:fs` を使う関係で、
公開ページにも `export const runtime = 'nodejs'` が貼られ全ルートが Node ランタイムに降格していた。
`@cloudflare/next-on-pages` は **全ての非静的ルートが `'edge'` ランタイム** であることを要求するため、
PR preview ビルドは常に失敗していた (#6 で明文化済)。

### Rework 経緯 (PR #28 レビュー指摘対応)

初版 PR #28 (commit c0267cb) のレビューで以下が指摘された:

1. **stale base** (BLOCKER): c0267cb は ab19a92 ベースで、その後 develop に merge された PR #24 (LHCI 統一) / #25 (a11y skill) / #26 (admin hook DRY) を実質 revert していた → `git merge origin/develop` で取り込み完了
2. **runtime 削除だけでは edge にならない** (BLOCKER): Next.js 15 では runtime 未指定の default は **nodejs**。`export const runtime = 'edge'` の **明示が必須**
3. **articles/journal/contact の node:fs 混入** (BLOCKER): `force-dynamic` + repositories barrel 経由で webpack edge entry に `node:fs` が混入

### 実際にやれたこと vs 期待値

理想は「公開ページに `runtime='edge'` を明示」だったが、調査の結果以下の **構造的依存** により
edge runtime を明示すると webpack build (`yarn build`) が落ちることが判明:

- **`src/app/layout.tsx`** が `profileRepo` を経由して `@/lib/repositories` を import している
  → root layout は全公開ページの親なので、子ページに `'edge'` を明示するだけで
    layout 経由で `JsonProductionRepository` → `node:fs` が edge bundle に混入する
- **`@/lib/repositories/index.ts`** が `JsonXxxRepository` を static import している
  → barrel 経由で `node:fs` が tree-shake されない
- **`react-markdown`** が server-only react export と非互換
  → /articles/[slug] の `ArticleBody` で edge ssr 失敗

これらは全て **本 PR スコープ外** (`src/lib/repositories/**`, `src/app/layout.tsx`, `src/lib/schemas/**` は禁止) のため、
本 PR では **「edge 化に向けた前処理」として静的化と node:fs 切り離しのみ** を実施する。

具体的には:
- `force-dynamic` を撤廃して **revalidate ベースの ISR/SSG** に統一
- `articles` / `articles/[slug]` / `journal` / `contact` / `/en` を `data/*.json` の **静的 import** に置換
  (repositories barrel / `node:fs` への直接依存を完全に断ち切る)
- `articles/[slug]` に `generateStaticParams` を追加して **SSG 化**
- runtime 指定は明示せず Next.js default に任せる
  (Phase 2 で layout / barrel rework と合わせて `runtime = 'edge'` を明示する計画)

結果として **build:cf エラーは admin + opengraph-image のみ** に削減され、公開ページは全て
SSG / Static として CF Pages の静的アセット配信に乗る。

## 変更ファイル (これ以外は触らない)

### 静的 import 化 + force-dynamic 撤廃

- `src/app/(use-header)/articles/page.tsx` — `data/articles.json` を静的 import / `articleSchema` で validation / `force-dynamic` 撤廃 / `revalidate = 3600`
- `src/app/(use-header)/articles/[slug]/page.tsx` — 同上方針 + `generateStaticParams` 追加で **SSG 化**
- `src/app/(use-header)/journal/page.tsx` — `data/feeds.json` を静的 import / `feedsSchema` で validation / `force-dynamic` 撤廃 / `revalidate = 3600`
- `src/app/(use-header)/contact/page.tsx` — `data/profile.json` を静的 import / `profileSchema` で validation / `force-dynamic` 撤廃
- `src/lib/i18n.ts` — `getLandingEn` を `node:fs` から `data/en/landing.json` の静的 import に変更 (`/en` の edge 互換性下準備)

### コメント整備 (runtime は Next.js default のまま、Phase 2 で edge 化する旨を記録)

- `src/app/(use-header)/home/page.tsx` — Phase 2 で edge 化予定とコメント
- `src/app/(use-header)/profile/page.tsx` — 同上
- `src/app/(use-header)/skill/page.tsx` — 同上
- `src/app/(use-header)/production/page.tsx` — 同上
- `src/app/(use-header)/production/(use-production)/[id]/page.tsx` — 同上 (`generateStaticParams` 維持)
- `src/app/(en-header)/en/page.tsx` — 同上

### 据え置き (再掲)

- `src/app/(use-header)/production/(use-production)/[id]/opengraph-image.tsx` — `runtime = 'nodejs'` + `dynamic = 'force-static'` のまま。barrel 経由の `node:fs` 混入を回避できないため Phase 2 まで継続。

### SSOT

- `.claude/tickets/perf-cf-edge-public.md` — 本ファイル

## Phase 1 完了で何が変わったか

| Route                                  | 元 (PR #28初版) | 現状 (本 rework)         | data source                            |
| -------------------------------------- | --------------- | ------------------------ | -------------------------------------- |
| /home                                  | nodejs default  | nodejs default (○ Static) | repositories barrel (unstable_cache)  |
| /profile                               | nodejs default  | nodejs default (○ Static) | repositories barrel (unstable_cache)  |
| /skill                                 | nodejs default  | nodejs default (○ Static) | repositories barrel (unstable_cache)  |
| /production                            | nodejs default  | nodejs default (○ Static) | repositories barrel (unstable_cache)  |
| /production/[id]                       | nodejs default  | nodejs default (● SSG)   | repositories barrel (unstable_cache)  |
| /production/[id]/opengraph-image       | nodejs (static) | nodejs (○ Static) 据え置き | repositories barrel (build時のみ)    |
| /articles                              | force-dynamic   | ○ Static                 | **data/articles.json 静的 import**     |
| /articles/[slug]                       | force-dynamic   | **● SSG**                | **data/articles.json 静的 import**     |
| /journal                               | force-dynamic   | ○ Static                 | **data/feeds.json 静的 import**        |
| /contact                               | force-dynamic   | ○ Static                 | **data/profile.json 静的 import**      |
| /en                                    | nodejs (fs)     | ○ Static                 | **data/en/landing.json 静的 import**   |
| admin/\*                               | nodejs          | nodejs (Phase 2)         | repositories barrel (node:fs)          |

公開ページの **全件** が `○ Static` / `● SSG` で静的配信になり、CF Pages では Edge ランタイム不要となる。
唯一の例外は `opengraph-image` (build:cf 内で「edge 必須」と報告されるが、`force-static` のため
実体は静的アセットとして配信される。Phase 2 で barrel rework と合わせて整理)。

## 禁止事項

- `src/app/admin/**/*` — PR-B-admin-edge の領域
- `src/app/api/admin/**/*` — 同上
- `src/app/layout.tsx` — PR #19 で完了済、本 PR で触らない (barrel 依存は Phase 2)
- `src/lib/repositories/**` — admin 側 Phase で KV/D1 へ移行する範囲
- `src/lib/schemas/**` — validation 仕様 SSOT、不変
- ライブラリ追加 (yarn.lock 不変)
- PR #24/25/26 の差分を revert すること

## 実装ポイント

- Next.js 15 では page の runtime デフォルトは **nodejs** であり、CF Pages では明示の `'edge'` が必須。
  ただし、layout / barrel の構造上、現時点で `'edge'` を明示すると `node:fs` 混入で build が落ちる。
- **代替アプローチ**: 公開ページを `○ Static` / `● SSG` 化することで edge ランタイム自体を不要にする。
- `articles` / `journal` / `contact` / `/en` は `force-dynamic` で動的化されており、
  かつ repositories barrel 経由で `node:fs` が edge bundle へ混入していたため、
  **静的 import + schema validation** に置き換えて barrel 依存を断ち切る。
- `articles/[slug]` は `generateStaticParams` を追加して SSG 化する。
- `opengraph-image.tsx` は `next/og` の `ImageResponse` が edge 互換だが、
  本ファイルが `@/lib/repositories` を import する以上 webpack の edge entry に
  `node:fs` が混入するため nodejs 据え置き。`dynamic = 'force-static'` のため
  最終出力は静的アセット (CF Pages 上の Edge 実行は不要)。

## 既知の懸念 (Phase 2 で扱う)

1. **`src/app/layout.tsx`** の `profileRepo` 依存を切り離す (静的 import 化 or lazy import)
2. **`src/lib/repositories/index.ts`** の barrel を REPOSITORY_DRIVER に応じて lazy/conditional に切り替え
3. **`react-markdown`** を client island 化して edge ssr 互換にする (articles/[slug] の edge 化)
4. 公開ページの `runtime = 'edge'` 明示移行 (上記 1, 2, 3 の完了後)
5. admin の `node:fs` → KV/D1 移行 (admin Phase の本体)

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build           # 通常 build 成功
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -50  # CF build
```

期待値:

- `yarn lint` / `yarn test` / `yarn build` はすべて成功
- `yarn build:cf` は **admin 系ルート + opengraph-image** のみ「The following routes were not configured to run with the Edge Runtime」として残る (記事 / journal / contact / home / profile / skill / production / production/[id] / en は全て静的配信に乗り消える)

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "fix(edge): rebase + 公開ルートに runtime=edge 明示 + articles/journal/contact を静的 import 化"
git push --force-with-lease
```

## レビュー観点 (チェックリスト)

- [ ] 公開ページの `force-dynamic` が全て撤廃されているか
- [ ] articles / journal / contact / /en が repositories barrel / `node:fs` 依存を持っていないか
- [ ] `articles/[slug]` が `generateStaticParams` で SSG 化されているか
- [ ] `opengraph-image.tsx` が `force-static` のまま据え置きされているか
- [ ] admin 系のファイル (`src/app/admin/**`, `src/app/api/admin/**`) に差分がないか
- [ ] PR #24/25/26 の差分が保持されているか (useAutoDismissOnSuccess / SkillView labelledby / hairline-strong 0.40 / lhci yarn 統一)
- [ ] `yarn build` (通常) が壊れていないか
- [ ] `yarn build:cf` の残エラーが admin + opengraph-image のみであるか
- [ ] Phase 2 の TODO (layout / barrel / react-markdown / runtime='edge' 明示) が SSOT に明記されているか
