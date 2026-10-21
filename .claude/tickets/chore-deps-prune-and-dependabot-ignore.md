# chore-deps-prune-and-dependabot-ignore

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/deps-prune-and-dependabot-ignore`
- **base**: `develop`
- **PR title**: `chore(deps): 未使用 jotai を削除 + Dependabot の ignore 追加 (@types/node / eslint-plugin-react-hooks major)`
- **依存**: Dependabot の npm PR (#72 minor/patch group / #76 emoji-regex) の処理完了後 (package.json / yarn.lock を触るため)
- **想定 reviewer 観点**: 本当に未使用か / lockfile の差分が最小か / ignore の妥当性

## 背景 (2026-10-22 Dependabot 仕分け)

- #74 `jotai` 2 → 3: `src` に `from 'jotai'` の import が 0 件 = **未使用依存**。bump ではなく削除する。
- #75 `@types/node` 24 → 26: 実行環境は Node 24 (.nvmrc)。型は実行環境の major に合わせるため major 更新は ignore。
- #73 `eslint-plugin-react-hooks` 5 → 7: CI (test/e2e/lhci) が fail。v6+ は flat config / 新ルール (React Compiler 系) への移行が必要で、
  単純 bump では済まない → 別 ticket で移行するまで major を ignore。

- #72 (minor/patch group) で `vercel` が 47.0.4 → **47.0.7** に上がった。dependabot.yml の vercel ignore が major/minor のみで patch を止めていなかったため。
  `@cloudflare/next-on-pages` の peer は `vercel >=30 <=47.0.4` なので peer 違反 (build:cf はローカルで成功したが将来壊れうる)。

## 変更ファイル (これ以外は触らない)

- `package.json` / `yarn.lock`:
  - `jotai` を削除 (`yarn remove jotai`)
  - `vercel` を exact `47.0.4` に戻す (next-on-pages peer 上限)
  - 上記以外の依存のバージョンは動かさない
- `.github/dependabot.yml`:
  - npm の ignore に `@types/node` (major) と `eslint-plugin-react-hooks` (major) を追加 (理由をコメント)
  - `vercel` は **全 update type** を ignore (patch も含む。next-on-pages の peer が `<=47.0.4` で固定のため。解除条件をコメント)
- `.claude/tickets/chore-deps-prune-and-dependabot-ignore.md` (本ファイル)

## 禁止事項

- jotai 以外の依存の追加・削除・更新 / src の変更

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
git grep -n "jotai" -- src   # 0 件
yarn lint && yarn test && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build
```
