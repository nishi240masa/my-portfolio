# Cloudflare Pages デプロイ設定について

## 現状 (Phase 2 完了後)

CF Pages Epic Phase 1 (`perf/cf-edge-public`) で公開ページが edge runtime に移行し、
Phase 2 (`perf/cf-edge-admin`, 本 PR) で admin / api/admin も edge runtime に移行した。

これにより `@cloudflare/next-on-pages` の「全ての非静的ルートが Edge Runtime」要件を
全ルートで満たし、**CF dashboard 側で必要な secrets を登録すれば PR preview を通せる状態**になった。

## 必須環境変数 / Secrets

Cloudflare Pages dashboard (`Settings → Environment variables`) で以下を登録する。
`Type` 列の `Secret` は機密扱い、`Plaintext` は平文で OK。

| Key | Type | 用途 |
| --- | --- | --- |
| `NODE_VERSION` | Plaintext | `20` |
| `NEXT_PUBLIC_SITE_URL` | Plaintext | `https://<pages-project>.pages.dev` または独自ドメイン |
| `REPOSITORY_DRIVER` | Plaintext | `github` (wrangler.toml の `[vars]` で既定済だが上書き可) |
| `GITHUB_OWNER` | Plaintext | `nishi240masa` (wrangler.toml で既定済) |
| `GITHUB_REPO` | Plaintext | `my-portfolio` (wrangler.toml で既定済) |
| `GITHUB_BRANCH` | Plaintext | `develop` (wrangler.toml で既定済) |
| `GITHUB_TOKEN` | **Secret** | fine-grained PAT (contents:write). admin から JSON を commit するため必須 |
| `AUTH_SECRET` | **Secret** | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | **Secret** | Google OAuth client id |
| `AUTH_GOOGLE_SECRET` | **Secret** | Google OAuth client secret |
| `ADMIN_EMAILS` | Plaintext | 管理アクセスを許可するメール (カンマ区切り) |

### Build settings

| 項目 | 値 |
| --- | --- |
| Build command | `yarn build:cf` |
| Build output directory | `.vercel/output/static` |
| Root directory | (未設定 / リポジトリルート) |
| Project name | `west-portfolio` (wrangler.toml の `name` と一致) |

## 仕組み

- `src/lib/repositories/index.ts`: `process.env.REPOSITORY_DRIVER ?? (NODE_ENV === 'production' ? 'github' : 'json')`
  - production build (CF Pages / `yarn build:cf`) では default が `github` に切替
  - `GITHUB_TOKEN` / `OWNER` / `REPO` が無いと **起動時に明示的に throw** する
- `src/app/admin/**/*` / `src/app/api/admin/**/*`: `runtime = 'nodejs'` を削除して edge runtime をデフォルト化
- `src/app/(use-header)/**/*`: PR-A (`perf/cf-edge-public`) で同様に edge 化済
- `src/lib/repositories/github/githubClient.ts`: `fetch` ベース + `Buffer` フォールバックの base64 で Workers 互換
- `next-auth` v5: edge 互換 (`auth()` を middleware で呼べる前提)

## ローカルでの再現

```bash
# dev/CI (json driver)
REPOSITORY_DRIVER=json NEXT_PUBLIC_SITE_URL=https://example.com yarn build

# Cloudflare Pages build (github driver)
REPOSITORY_DRIVER=github \
  GITHUB_TOKEN=<your-pat> \
  GITHUB_OWNER=nishi240masa \
  GITHUB_REPO=my-portfolio \
  GITHUB_BRANCH=develop \
  NEXT_PUBLIC_SITE_URL=https://example.com \
  yarn build:cf
```

GitHub Actions の CI (`.github/workflows/test.yml`) では `REPOSITORY_DRIVER=json` を明示しており、
PR ごとの GitHub API 書き込みを伴わずに通常の `yarn build` を行う。

## 既知の残課題

- CF Pages dashboard 側 secrets 設定は **手動で 1 回行う必要がある**。
  自動化したい場合は GitHub Actions の `cloudflare/pages-action` 等でビルドする経路に切替える。
- `next-auth` v5 (beta) で `jose` 由来の `CompressionStream` 警告が build 時に出るが、edge 動作には影響しない。
- Server Action からの `revalidateTag()` は edge runtime でも動作する想定だが、CF Pages 上での挙動は要検証 (Phase 3 候補)。

## 過去の状態 (Phase 1 / Phase 2 着手前)

`feat: implement admin dashboard with content management and authentication via JSON repositories` (d080cf6) で
admin が `src/lib/repositories/json/jsonFile.ts` 経由で `node:fs` を使用するようになり、
全ルートが `runtime = 'nodejs'` を要求するようになっていた。
これが `@cloudflare/next-on-pages` の Edge Runtime 要件と衝突し、CF Pages PR preview は失敗していた。

Phase 1 (PR-A: 公開ページの edge 化) と Phase 2 (本 PR: admin の edge 化 + github driver default 化) で根本対処済。
