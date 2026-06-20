# perf-cf-edge-admin

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `perf/cf-edge-admin`
- **base**: `develop`
- **PR title**: `perf(edge): admin + api/admin を edge runtime に移行 (CF Pages Phase 2)`
- **依存**: PR-A (`perf/cf-edge-public`) — 公開ページの edge 化が前提 (file overlap なし、並列でも可)
- **想定 reviewer 観点**: アーキテクト / Perf / CF Pages 互換性

## ゴール

Cloudflare Pages の PR preview ビルドを通すための **Phase 2 (admin 側)**。

- admin pages (`src/app/admin/**/*`) と api/admin routes (`src/app/api/admin/**/*`) の `runtime = 'nodejs'` を削除し、edge runtime をデフォルト化
- `src/lib/repositories/index.ts` で `NODE_ENV === 'production'` のとき REPOSITORY_DRIVER の default を `github` に強制
- json driver は node:fs 依存なので production では使用不可と明示
- CI workflow には `REPOSITORY_DRIVER=json` を渡して通常 build を継続できるようにする
- wrangler.toml / docs / .env.example で本番 deploy 時の env 設定手順を整える

## 変更ファイル (これ以外は触らない)

- `src/app/admin/layout.tsx` — `export const runtime = 'nodejs'` を削除
- `src/app/admin/page.tsx` — 同上
- `src/app/admin/login/page.tsx` — 同上
- `src/app/admin/home/page.tsx`, `profile/page.tsx`, `skill/page.tsx`, `productions/page.tsx`, `productions/[id]/page.tsx`, `productions/new/page.tsx` — 同上
- `src/app/api/admin/home/route.ts`, `profile/route.ts`, `skills/route.ts`, `productions/route.ts`, `productions/[id]/route.ts` — 同上
- `src/lib/repositories/index.ts` — `process.env.REPOSITORY_DRIVER ?? (NODE_ENV === 'production' ? 'github' : 'json')`
- `src/lib/repositories/json/*` — 各 driver ファイル先頭に「dev/test 専用」コメントを追加
- `.env.example` — production deploy で必須となる env のコメント強化
- `wrangler.toml` — `[vars]` で REPOSITORY_DRIVER=github / GITHUB_OWNER / REPO / BRANCH を default 化、GITHUB_TOKEN は secret であることをコメント
- `docs/CLOUDFLARE_PAGES_SETUP.md` — Phase 2 完了後の状態を反映 (CF dashboard 必須 secrets 手順)
- `.github/workflows/test.yml` — build step に `REPOSITORY_DRIVER=json` を追加
- `.claude/tickets/perf-cf-edge-admin.md` (新規・本ファイル) — 仕様 SSOT
- `docs/PROGRESS.md` — 進行中エピックの状態更新

## 禁止事項

- `src/app/(use-header)/**/*` — PR-A (`perf/cf-edge-public`) のスコープ
- `src/lib/repositories/github/*` — API 変更は別 PR (現状の export は維持)
- ライブラリ追加 (yarn.lock 不変)
- `src/lib/admin/auth.ts` のロジック変更 (require admin のみ最小タッチ)

## 実装ポイント

- next-auth v5 (beta) は edge 互換。`auth()` を Server Component / middleware / Server Action から呼べる。
- Server Actions (`'use server'`) は edge runtime で動作可能。runtime export は付けない (page と同じく default)。
- `src/lib/repositories/github/githubClient.ts` は既に `Buffer` フォールバック + `fetch` ベースで Workers 互換。
- `src/lib/repositories/index.ts` の `assertGitHubEnv()` は driver 解決時 1 回のみ実行。production で env 不足なら build 時 / 初回 import 時に throw。
- json driver は import されるだけで node:fs 依存が edge bundle に混入するが、production build 時は github driver 経路のみが選択され、`switch (assertedDriver)` で json は走らないため実害なし (Tree shaking で削れる想定)。
- `wrangler.toml` の `[vars]` は public env (非機密)。`GITHUB_TOKEN` / `AUTH_SECRET` 等は dashboard で Secret として設定。

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests

# dev/CI 経路: json driver で通常 build
REPOSITORY_DRIVER=json NEXT_PUBLIC_SITE_URL=https://example.com yarn build

# CF Pages 経路: github driver で edge build
REPOSITORY_DRIVER=github \
  GITHUB_TOKEN=dummy \
  GITHUB_OWNER=nishi240masa \
  GITHUB_REPO=my-portfolio \
  GITHUB_BRANCH=develop \
  NEXT_PUBLIC_SITE_URL=https://example.com \
  yarn build:cf 2>&1 | tail -30
```

build:cf が完璧に通らなくても、admin の edge 化が技術的に可能であることが示せれば OK。
残課題は CF dashboard 側 secrets 設定手順として `docs/CLOUDFLARE_PAGES_SETUP.md` に明記。

## レビュー観点 (チェックリスト)

- [ ] `runtime = 'nodejs'` が admin / api/admin の全 page / route から削除されている
- [ ] `(use-header)/**/*` (PR-A の領域) には触れていない
- [ ] `assertGitHubEnv()` のチェックロジックを壊していない
- [ ] CI workflow で REPOSITORY_DRIVER=json が渡って従来通り build が通る
- [ ] yarn.lock 変更なし
- [ ] `wrangler.toml` の `[vars]` に機密情報 (TOKEN / SECRET) が無い
