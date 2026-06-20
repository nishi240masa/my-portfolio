# perf-cf-edge-public

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `perf/cf-edge-public`
- **base**: `develop`
- **PR title**: `perf(edge): 公開ページ + OG画像を edge runtime に移行 (CF Pages Phase 1)`
- **依存**: PR #5 (GitHub Contents API driver) / PR #9 (unstable_cache + ISR) / PR #19 (root layout の cookies() 局所化) — いずれも develop に merge 済
- **想定 reviewer 観点**: Performance / Cloudflare Pages 互換性 / アーキテクト

## ゴール

CF Pages PR preview ビルドを通すための **Phase 1**。
公開ページ全部 (home / profile / skill / production[/id] / articles[/slug] / journal / en / contact) と
動的 OG 画像 (production/[id]/opengraph-image) を Edge runtime に移行する。
admin の Edge 化 (`node:fs` 排除と KV/D1 移行) は別 PR (PR-B-admin-edge) で対応。

## 背景

`docs/CLOUDFLARE_PAGES_SETUP.md` と `docs/PROGRESS.md` の通り、
admin が `src/lib/repositories/json/jsonFile.ts` 経由で `node:fs` を使う関係で、
公開ページにも `export const runtime = 'nodejs'` が貼られ全ルートが Node ランタイムに降格していた。
`@cloudflare/next-on-pages` は **全ての非静的ルートが `'edge'` ランタイム** であることを要求するため、
PR preview ビルドは常に失敗していた (#6 で明文化済)。

本 PR では public 部分のみ先に Edge 化することで、admin Phase 2 の差分を限定し、
レビュー粒度を保ったまま CF Pages 互換性を段階的に取り戻す。

## 変更ファイル (これ以外は触らない)

- `src/app/(use-header)/home/page.tsx` — `export const runtime = 'nodejs'` を削除 (default edge にする)
- `src/app/(use-header)/profile/page.tsx` — 同上
- `src/app/(use-header)/skill/page.tsx` — 同上
- `src/app/(use-header)/production/page.tsx` — 同上
- `src/app/(use-header)/production/(use-production)/[id]/page.tsx` — 同上
- `src/app/(use-header)/articles/page.tsx` — 同上
- `src/app/(use-header)/articles/[slug]/page.tsx` — 同上
- `src/app/(use-header)/journal/page.tsx` — 同上
- `src/app/(en-header)/en/page.tsx` — 同上
- `src/app/(use-header)/contact/page.tsx` — 同上
- `src/app/(use-header)/production/(use-production)/[id]/opengraph-image.tsx` — **当初は `'edge'` 化予定だったが、build 時に `@/lib/repositories` 経由で JSON repos の `node:fs` import が edge ssr entry のバンドルに混入し webpack `UnhandledSchemeError` で失敗。`dynamic = 'force-static'` のため最終出力は `○ (Static)` として静的化されるため、`'nodejs'` のまま据え置きとする (CF Pages 上では静的アセット配信になり Edge ランタイム不要)。lazy-import 化での `'edge'` 移行は Phase 2 (admin edge 化) の `src/lib/repositories/index.ts` 再構成と合わせて扱う。**
- `.claude/tickets/perf-cf-edge-public.md` (新規) — 本 PR の仕様を SSOT として記録
- `docs/PROGRESS.md` — 「CF Pages Epic」セクションを Follow-up から「進行中」に格上げし PR-A 完了を追記

## 禁止事項

- `src/app/admin/**/*` — PR-B-admin-edge の領域
- `src/app/api/admin/**/*` — 同上
- `src/app/layout.tsx` — PR #19 で完了済
- `src/lib/repositories/json/*` — admin 側 Phase で KV/D1 へ移行する範囲
- ライブラリ追加 (yarn.lock 不変)

## 実装ポイント

- Next.js の page では runtime 指定がない場合 default は edge ではなく **nodejs** だが、
  `@cloudflare/next-on-pages` のビルド時には Edge ランタイム指定が必須。
  公式ガイドに従い `runtime = 'nodejs'` のみ削除して **default (Next App Router の deploy default)** に任せ、
  CF on-Pages の adapter が edge function として処理できるようにする。
- `opengraph-image.tsx` は `runtime = 'edge'` を明示。`next/og` の `ImageResponse` は edge 対応。
- 公開ページの内部実装 (`unstable_cache` + GitHub Contents API driver + `react-markdown` + `next/og`) は
  いずれも fetch ベース / WHATWG API ベースなので Edge 互換のはず。
- ローカル `yarn build` (Vercel ランタイム前提) はそのまま通る必要がある。
  CF Pages CI は Phase 1 完了時点では **admin 残存ルートのみ** Node ランタイム由来でエラーが出る想定で、
  エラーメッセージの該当ルートが admin のみであれば期待通り。

## エッジ互換性チェックリスト (実装中に確認)

- `unstable_cache` は edge runtime で動く (Next.js 14+ で対応)
- GitHub Contents API driver は fetch ベースなので edge で動く
- `next/og` の `ImageResponse` は edge で動く
- markdown-renderer (`react-markdown` + `remark-gfm`) は edge で動く

## 既知の懸念 (Phase 2 で扱う)

- `src/app/(use-header)/journal/page.tsx` は現状ローカル開発時に `node:fs` で `data/feeds.json` を読む。
  CF Pages 上で実走させる場合は fetch ベースのリーダーへ差し替える必要がある (Phase 2 のスコープ)。
- 公開ページ JSON repos (`JsonProductionRepository` 等) はローカル `REPOSITORY_DRIVER=json` 時に `node:fs` 経由。
  CF Pages では `REPOSITORY_DRIVER=github` が前提となる。
- 上記は Phase 1 のスコープ外 (PR body にも明記)

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build           # 通常 build が壊れていないこと
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -30  # CF build を試行
```

期待値:

- `yarn lint` / `yarn test` / `yarn build` はすべて成功
- `yarn build:cf` は **admin 系ルートの「The following routes were not configured to run with the Edge Runtime」**のみ残るのが理想。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "perf(edge): 公開ページ + OG画像を edge runtime に移行 (CF Pages Phase 1)"
git push -u origin perf/cf-edge-public
gh pr create --base develop --head perf/cf-edge-public \
  --title "perf(edge): 公開ページ + OG画像を edge runtime に移行 (CF Pages Phase 1)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] `runtime = 'nodejs'` が公開ページから全て消えているか
- [ ] `opengraph-image.tsx` が `'edge'` 指定になっているか
- [ ] admin 系のファイル (`src/app/admin/**`, `src/app/api/admin/**`) に差分がないか
- [ ] `yarn build` (Vercel デフォルト) が壊れていないか
- [ ] `yarn build:cf` のエラーが admin 起因のみであるか (もしくは admin + 既知の Phase 2 懸念のみであるか)
- [ ] `docs/PROGRESS.md` が更新されているか
