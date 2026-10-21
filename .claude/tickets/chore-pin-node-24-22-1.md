# chore-pin-node-24-22-1

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/pin-node-24-22-1`
- **base**: `develop`
- **PR title**: `chore(ci): Node を 24.22.1 (2026-10-21 security release) に固定`
- **依存**: PR #62 (Node 24 統一) が develop に入っていること (済)
- **想定 reviewer 観点**: 全実行環境で修正済み Node が使われることの担保 / CI 破壊なし

## 背景

Node.js 2026-10-21 Security Releases
(https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) で
24.x の修正版は **v24.22.1** (HIGH: CVE-2026-105482 / 105483 / 106069 / 111497 ほか)。

現状 workflows は `node-version: '24'` で、`actions/setup-node@v4` は runner の
tool cache を優先するため **CI は脆弱な v24.22.0 で実行されている**
(run 39638940005: `Found in cache @ /opt/hostedtoolcache/node/24.22.0` → `node: v24.22.0`)。
`.nvmrc` = `24` も同様にパッチを担保しない。

## ゴール

ローカル / CI / CF Pages の Node を **24.22.1 以上**に担保する。

## 変更ファイル (これ以外は触らない)

- `.nvmrc` → `24.22.1` (Node バージョンの SSOT。CF Pages の build も .nvmrc を参照)
- `.github/workflows/*.yml` の全 `actions/setup-node` (test / e2e / lhci / deploy ×2 / feeds):
  `node-version: '24'` を削除し `node-version-file: '.nvmrc'` に置き換える (SSOT 化)。
  cache 由来の旧パッチを防げることを CI ログ (`node: v24.22.1`) で確認する
- `.claude/scripts/preflight.sh`: ok 判定を `>= 24.22.1` に (24.0–24.22.0 は「security fix 未適用」の warn)。patch まで比較する
- `CLAUDE.md` / `docs/PROGRESS.md` の Node 記述: 「Node 24.22.1 (.nvmrc SSOT, 2026-10-21 security release)」を反映。
  `.claude/RESUME.md:40` の `>= 20 必須` も直す
- `.claude/tickets/chore-pin-node-24-22-1.md` (本ファイル)

## 禁止事項

- `package.json` の `engines` 変更 (`>=24` 系にすると vercel@47.0.4 同梱 build-utils が build:cf を拒否するため据え置き。PR 本文で理由を明記)
- 依存 (package.json / yarn.lock) の変更

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"   # node -v → v24.22.1
bash .claude/scripts/preflight.sh                 # node ok
yarn lint && yarn test
```

PR の CI 各 job の Setup Node.js ログで `node: v24.22.1` を確認し、PR 本文に記載する。
PR 本文に「Vercel 本番はダッシュボードの Node.js Version 24.x (Vercel 管理の最新パッチ) — オーナーがビルドログで 24.22.1 以上を確認」と記載。
