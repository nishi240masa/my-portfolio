# fix-admin-login-edge-node-fs

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `fix/admin-login-edge-node-fs`
- **base**: `develop`
- **PR title**: `fix(admin): /admin/login が CF Pages edge で 500 (No such module "node:fs") になる問題を修正`
- **依存**: なし
- **想定 reviewer 観点**: 根本原因の特定 / edge bundle から node:fs を排除できているか / 他 edge route への波及 / 回帰テスト

## 症状 (2026-10-22 本番 https://w3st.net で確認)

- `/admin/login` → **500**。`/admin` → 302 (login へ)、`/api/auth/providers`・`/api/auth/session` → 200。
- PR #60 の検証時、`wrangler pages dev` で `/admin/login` が 500、ログは `No such module "node:fs"`。
  原因の webpack chunk (hash `4a663d83...`) は当時の develop の出力にも同一で存在 = 既存不具合。
- 本番で admin にログインできない (優先度高)。

## 既知の情報

- `src/app/admin/login/page.tsx`: `runtime = 'edge'`, `dynamic = 'force-dynamic'`、`@/auth` と `./LoginForm` (client, `next-auth/react` の signIn) を import。
- `src/app/admin/layout.tsx`: `runtime = 'edge'`、`@/auth` と `AdminSignOutButton` を import。
- `src/auth.ts`: `next-auth` と Google provider のみ import。
- repo 内で `node:fs` を static import しているのは `src/lib/repositories/json/jsonFile.ts` のみ
  (`src/lib/repositories/index.ts` は driver を dynamic import する設計。CLAUDE.md「edge 互換を維持」)。
- 他の admin 配下ページ (productions / profile / skill / home) や Server Actions (`_actions`) が json driver を
  静的に引き込み、layout / login と **共有 chunk** になっている可能性が高い。

## ゴール

`/admin/login` が CF Pages (edge) で 200 を返し、Google ログインボタンが表示される。
edge 向け出力 (`.vercel/output/static/_worker.js`) のどの chunk にも `node:fs` / `node:path` の
**実行時 require が残らない** (少なくとも admin 系 route が読む chunk から排除)。

## 進め方

1. 再現: `rm -rf .next && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf` →
   `yarn preview` (必要なら `--binding AUTH_SECRET=dummy AUTH_TRUST_HOST=true` 等) で `/admin/login` 500 と `No such module "node:fs"` を確認。
2. 原因特定: `_worker.js/__next-on-pages-dist__/` 等で `node:fs` を含む chunk を grep し、その chunk を読む route と
   import 経路 (どのモジュールが jsonFile.ts / node:fs を引き込むか) を突き止める。`next build` の webpack stats 等も可。
3. 修正: 引き込み経路を断つ (static import → dynamic import / server-only 境界の整理 / edge で使わない
   モジュールを分離 等)。**設計 (driver パターン, edge fail-fast guard) は維持**。
4. 回帰防止: build:cf 出力の edge chunk に `node:fs` が含まれないことを検査するテスト or スクリプト
   (例: `scripts/check-edge-bundle.mjs` を追加し CI の test job で実行) を検討。追加するなら test.yml に 1 step 追加まで可。

## 変更ファイル

- 原因箇所の src (admin 配下 / repositories / auth 周り) — 最小限
- 回帰検査 (任意): `scripts/check-edge-bundle.mjs` 新規 + `.github/workflows/test.yml` に step 追加
- `.claude/tickets/fix-admin-login-edge-node-fs.md` (本ファイル)

## 禁止事項

- `runtime = 'edge'` を外して node runtime に逃がす (CF Pages では node runtime route は動かない)
- package.json / yarn.lock / wrangler.toml の変更 (必要なら理由を PR に書き PM に相談)
- 機能変更・無関係なリファクタ

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
rm -rf .next && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf
yarn preview   # /admin/login 200、/admin 302、/ 200、/api/auth/providers 200
grep -rl "node:fs" .vercel/output/static/_worker.js | head   # admin 系 chunk に無いこと
```

PR 本文に: 根本原因 (import 経路)、修正前後の preview 結果、PR の Preview URL (preview.yml) での `/admin/login` の結果。
