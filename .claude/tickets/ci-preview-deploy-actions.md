# ci-preview-deploy-actions

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `ci/preview-deploy-actions`
- **base**: `develop`
- **PR title**: `ci(preview): PR ごとの CF Pages Preview デプロイを GitHub Actions に移行`
- **依存**: PR #64 (CF デプロイを Actions に一本化) / #65 が develop に入っていること (済)
- **想定 reviewer 観点**: secrets の扱い (fork / Dependabot) / Node 担保 / 本番 deploy への非干渉 / workflow の権限最小化

## 背景

- CF Pages の Git 連携 Preview ビルドは (1) Preview 環境に `GITHUB_TOKEN` 未登録で `/sitemap.xml` の page data 収集が失敗、
  (2) CF build image の Node が **24.13.1** (2026-10-21 security release 未適用) で Node を担保できない。
- オーナー判断: Git 連携 Preview ビルドは dashboard で OFF (Branch control → Preview branches: None)、
  代わりに **GitHub Actions で PR ごとに Preview デプロイ** する。

## ゴール

PR を出すと Actions が (最新 24.x patch で) `build:cf` → `wrangler pages deploy --branch=<head ref>` し、
Preview URL を PR にコメントする。本番 (`deploy.yml`, main push) には影響しない。

## 変更ファイル (これ以外は触らない)

- `.github/workflows/preview.yml` (新規)
  - `on: pull_request` (types: opened / synchronize / reopened、branches: develop / main)
  - **secrets が無い PR はスキップ**: `if: github.event.pull_request.head.repo.full_name == github.repository && github.actor != 'dependabot[bot]'`
  - `concurrency: preview-${{ github.event.pull_request.number }}` + `cancel-in-progress: true`
  - `permissions` 最小: `contents: read`, `deployments: write`, `pull-requests: write`
  - setup-node: `node-version-file: '.nvmrc'` + `check-latest: true` + `cache: 'yarn'` (他 workflow と同じ)
  - `yarn install --frozen-lockfile` → `NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf`
    (canonical は本番を指す = preview の重複インデックス回避。deploy.yml と同じ値)
  - `cloudflare/wrangler-action@v3` (deploy.yml と同じ action / 同じ secrets) で
    `pages deploy .vercel/output/static --project-name=west-portfolio --branch=${{ github.head_ref }}`
  - wrangler-action の output (`deployment-url` / `pages-deployment-alias-url`) を使い、
    `gh pr comment --edit-last` 等で **1 PR 1 コメントを更新** (無ければ作成)。第三者 action は追加しない
- `.github/workflows/deploy.yml`: `pages deploy` に `--branch=main` を明示 (本番 = production branch を確実に。ロジックはそれのみ)
- `docs/CLOUDFLARE_PAGES_SETUP.md`: デプロイ経路に「PR → preview.yml で Preview / main → deploy.yml で Production」、
  Git 連携は Production / Preview とも OFF、Preview 環境の runtime Secret (動的ルートを試すなら GITHUB_TOKEN / ADMIN_EMAILS / AUTH_GOOGLE_*)、
  fork / Dependabot PR は Preview が skip される旨、ロールバック手順 (Deployments → Rollback)
- `CLAUDE.md`: PR に付く `Cloudflare Pages` check (Git 連携由来) の記述を、preview.yml の Preview に置き換え
- `.claude/tickets/ci-preview-deploy-actions.md` (本ファイル)

## 禁止事項

- `package.json` / `yarn.lock` / `wrangler.toml` / src の変更
- 新規の第三者 GitHub Action の導入
- `deploy.yml` のトリガ・job 構成変更 (`--branch=main` 追加のみ)

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
# workflow 構文: actionlint があれば実行、無ければ YAML parse
```

- この PR 自体で preview.yml が走るので、Actions ログで (1) `node: v24.22.x` 以上、(2) `pages deploy` 成功、
  (3) PR に Preview URL コメントが付き、その URL の `/` が 200 であることを確認し PR 本文に記載。
  (Secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` は登録済み)
- 2 回目の push でコメントが増えず更新されることを確認 (可能なら)。
