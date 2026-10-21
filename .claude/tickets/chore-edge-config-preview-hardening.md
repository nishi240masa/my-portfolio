# chore-edge-config-preview-hardening

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/edge-config-preview-hardening`
- **base**: `develop`
- **PR title**: `chore: next.config の不要 node:fs externals 整理 + preview.yml のハードニング`
- **依存**: Dependabot の Actions 更新 PR (#68 checkout / #69 setup-node / #70 wrangler-action / #71 upload-artifact) の処理完了後 (preview.yml の同じ行を触るため)
- **想定 reviewer 観点**: edge bundle に node:fs が戻らないこと / preview が引き続き動くこと / 権限最小化

## 背景

- PR #79 で json driver が edge bundle から除外され、`next.config.mjs` の `node:fs` / `node:path` externals とそのコメント
  (「dynamic chunk が bundle されるのは許容」) が実態とずれた。
- PR #67 review の minor 3 点 (preview.yml):
  1. 未使用の `permissions: deployments: write` を削除
  2. `actions/checkout` に `persist-credentials: false`
  3. Dependabot 判定を `github.actor` ではなく `github.event.pull_request.user.login` で行う

## 変更ファイル (これ以外は触らない)

- `next.config.mjs`: externals が本当に不要なら削除 (不要と言えない場合はコメントを実態に合わせるだけ)。
  削除後も `scripts/check-edge-bundle.mjs` が pass し、`build:cf` が通ること
- `.github/workflows/preview.yml`: 上記 3 点
- `.gitignore`: `/my-portfolio/` を追加 (PR #83 で、worktree の node_modules symlink 共有下で `next build` が worktree 直下に
  `my-portfolio/node_modules/...` を生成し commit に混入した。再発防止)。原因 (どの設定がその path を作るか) が特定できれば PR 本文に記載
- `.claude/tickets/chore-edge-config-preview-hardening.md` (本ファイル)

## 禁止事項

- `src/lib/repositories/**` の変更 / package.json / yarn.lock / wrangler.toml の変更

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
rm -rf .next && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf
node scripts/check-edge-bundle.mjs
```
PR で preview.yml が走り、Preview デプロイとコメント更新が成功すること。
