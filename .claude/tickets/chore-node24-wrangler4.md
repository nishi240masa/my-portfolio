# chore-node24-wrangler4

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/node24-wrangler4`
- **base**: `develop`
- **PR title**: `chore(deps): Node 24 に統一し wrangler 4 へ更新 (esbuild advisory 解消)`
- **依存**: PR #60 (依存脆弱性解消) が develop に入っていること (済)
- **想定 reviewer 観点**: CI / deploy の既存破壊 / edge (CF Pages) build・preview 互換 / audit 残件

## ゴール

1. ローカル (nodebrew v24.22.1 に切替済) と CI・本番の Node を **Node 24** に揃える。
2. `wrangler` を 3.x → **4.x 最新** (現 4.151.3, engines `node >=22`) に上げ、
   #60 で残置した esbuild advisory 1102341 (wrangler 3 > esbuild 0.17.19) を解消する。
3. `yarn audit` の残件を「修正版なし (braces / extract-zip / sprintf-js)」のみにする。

## 変更ファイル (これ以外は触らない)

- `.nvmrc` → `24`
- `package.json`
  - `engines.node` → `>=24.0.0`
  - `wrangler` → `^4.x` 最新
  - `@types/node` → `^24` 系 (型エラーが出ないこと)
  - `resolutions` の見直し: wrangler 4 化で不要になったもの (`**/wrangler/sharp` 等) は削除、
    Node 22.12+ 制約で固定していたもの (`**/katex: 0.18.4` — commander 15 が Node >=22.12 要求) は
    patched 最新に上げられるなら上げる (deprecated 版は避ける)
- `yarn.lock`
- `.github/workflows/*.yml` の `node-version: '20'` → `'24'` (test / e2e / lhci / deploy ×2 / feeds の全箇所)
- `CLAUDE.md` の「Node >= 20 必須 / デフォルト shell は Node 18」記述を Node 24 前提に更新
- `.claude/tickets/chore-node24-wrangler4.md` (本ファイル)
- 依存更新で lint/型/build エラーが出た場合に限り最小限の src 修正可 (PR 本文に理由)

## 禁止事項

- Next 16 / React / MUI などフレームワーク major bump
- npm / pnpm の使用
- 機能変更・リファクタ
- `wrangler.toml` の `compatibility_date` 変更は wrangler 4 で必須な場合のみ (理由を PR 本文に)

## 注意点

- wrangler 4 は `wrangler pages dev` / `pages deploy` の CLI 互換を確認する
  (`package.json` の `preview` script、`deploy.yml` の `cloudflare/wrangler-action@v3` + `command: pages deploy ...`)。
  wrangler-action が wrangler 4 を使えるか (`wranglerVersion` 指定が必要か) も確認。
- `@cloudflare/next-on-pages` の peer 依存 (wrangler / vercel range) を満たすこと。
- Vercel 本番の Node バージョンはダッシュボード設定 (`engines` 参照) なので、`engines` 変更の影響を PR 本文に記載。

## 検証 (全て green 必須, Node v24.22.1)

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"   # node -v → v24.22.1
yarn install --frozen-lockfile
yarn audit --summary          # 残件 = 修正版なしのみ
yarn lint && yarn test
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
rm -rf .next && NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf
yarn preview                  # wrangler 4 で起動し / と /api/auth/providers が 200
```

PR 本文に audit の before/after と残置 advisory を記載する。

## 実装メモ (仕様からの逸脱)

- `engines.node` は `>=24.0.0` ではなく **`>=22.12.0`** とした。
  `vercel@47.0.4` (next-on-pages peer 上限で固定) 同梱の `@vercel/build-utils@12.1.0` が Node 24 を知らず、
  `>=24.0.0` だと `yarn build:cf` (= `vercel build`) が `BUILD_UTILS_NODE_VERSION_INVALID` で失敗するため。
  下限 22.12 は wrangler 4 (>=22) と katex 0.18.5+ の commander 15 (>=22.12) の実制約。
  ローカル (`.nvmrc`) / CI は 24 に統一済。
- `**/undici` の全域 resolution は miniflare 5 (wrangler 4) が要求する undici 7.29.1 を 6.x に落としてしまうため、
  旧来の対象 (@vercel/blob / @vercel/node / next-on-pages 配下 miniflare 3) に限定した。
