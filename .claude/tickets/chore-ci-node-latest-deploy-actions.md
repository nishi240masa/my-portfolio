# chore-ci-node-latest-deploy-actions

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/ci-node-latest-deploy-actions`
- **base**: `develop`
- **PR title**: `chore(ci): Node 24 最新パッチを自動追随 + CF デプロイを Actions に一本化 + Dependabot 導入`
- **依存**: PR #63 (Node 24.22.1 固定) が develop に入っていること (済)
- **想定 reviewer 観点**: セキュリティパッチの自動担保 / deploy 経路の健全性 / メンテ負荷 / Dependabot の noise

## 背景 (2026-10-22 調査)

- `.nvmrc` = `24.22.1` の patch 固定は security release ごとに手動 bump が必要 (オーナーのメンテ負荷)。
- CF Pages の **Git 連携ビルド** は 25 commit 以上連続 failure:
  - main: `REPOSITORY_DRIVER=github` (wrangler.toml `[vars]`) なのに `GITHUB_TOKEN/OWNER/REPO` が dashboard 未登録 → `/sitemap.xml` の page data 収集で throw。
  - develop (#63 以降): CF build image の node-build が `24.22.1` 未対応 (`definition not found: 24.22.1`)。
- オーナー判断: CF デプロイは **GitHub Actions (`deploy.yml`) に一本化** し、Git 連携の自動ビルドは dashboard で OFF にする (オーナー作業)。本番 canonical URL は **`https://w3st.net`**。

## ゴール

1. CI / deploy の Node が **常に 24.x 最新パッチ** (security fix 込み) になり、手動 bump 不要。
2. CF Pages への本番デプロイ経路を `deploy.yml` (lint + test → build:cf → wrangler pages deploy) の 1 本にし、ドキュメントを実態に合わせる。
3. Actions / npm 依存の更新を Dependabot で自動 PR 化する。

## 変更ファイル (これ以外は触らない)

- `.nvmrc` → `24`
- `.github/workflows/*.yml` の全 `actions/setup-node` (test / e2e / lhci / deploy ×2 / feeds):
  `node-version-file: '.nvmrc'` を維持し **`check-latest: true` を追加** (tool cache の古い patch を使わせない)
- `.github/dependabot.yml` (新規):
  - `github-actions` と `npm` (yarn v1 lockfile 対応) の 2 ecosystem、`target-branch: develop`、weekly
  - noise 抑制: minor/patch を group 化、`open-pull-requests-limit` を控えめに
  - npm は Next / React / MUI / next-auth の **major** を ignore (フレームワーク major は別 ticket で手動判断)
  - commit message は conventional (`chore(deps)` / `chore(ci)`) になるよう `commit-message.prefix` 設定
- `.claude/scripts/preflight.sh`: 現行判定 (>= 24.22.1 ok / 24.0–24.22.0 warn) は維持。文言を「.nvmrc は 24 (CI は check-latest で最新 patch)」に合わせる
- `docs/CLOUDFLARE_PAGES_SETUP.md`:
  - `NODE_VERSION` 行を削除し「dashboard に NODE_VERSION を登録しない (.nvmrc より優先されるため)」と明記
  - `NEXT_PUBLIC_SITE_URL` を `https://w3st.net` に
  - デプロイ経路: Actions 一本化、Git 連携の自動ビルドは OFF (Settings → Builds → Branch control) と明記。必要な GitHub Secrets (`CLOUDFLARE_API_TOKEN` = Account / Cloudflare Pages / Edit のみ、`CLOUDFLARE_ACCOUNT_ID`)
  - CF dashboard の **runtime** 環境変数 (REPOSITORY_DRIVER / GITHUB_* / AUTH_* / ADMIN_EMAILS / NEXT_PUBLIC_SITE_URL) は引き続き必要な旨
- `CLAUDE.md` / `docs/PROGRESS.md` / `.claude/RESUME.md` の Node 記述: 「Node 24 (.nvmrc) + CI は check-latest で最新 patch、ローカルは 24.22.1 以上」に更新
- `.claude/tickets/chore-ci-node-latest-deploy-actions.md` (本ファイル)

## 禁止事項

- `package.json` / `yarn.lock` / src の変更
- `wrangler.toml` の変更
- `deploy.yml` のトリガ・job 構成の変更 (setup-node の `check-latest` 追加のみ)

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"   # v24.22.1
bash .claude/scripts/preflight.sh
yarn lint && yarn test
# deploy.yml の build:cf を Actions と同条件で再現 (REPOSITORY_DRIVER / GITHUB_* 未設定)
rm -rf .next && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf
```

- dependabot.yml の妥当性: GitHub の schema に沿っているか (`gh api` で PR 作成後に Insights → Dependency graph のエラー有無を確認できれば記載)
- PR の CI 各 job の Setup Node.js ログで `check-latest` により `node: v24.22.1` (以上) が使われていることを確認し PR 本文に記載
- PR 本文に「オーナー作業」として: GitHub Secrets 登録 / CF Git 連携自動ビルド OFF / CF runtime env 登録 を列挙
