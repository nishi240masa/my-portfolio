# Cloudflare Pages デプロイ設定について

## 現状 (Phase 2 完了)

Phase 2 (Edge Runtime 移行) 完了により、本プロジェクトは **Cloudflare Pages で動作する状態** になりました。

- 全ての非静的ルート (`/admin/*`, `/api/admin/*`, `/api/auth/[...nextauth]`, `/home`, `/production/*`, `/profile`, `/skill`) は `export const runtime = 'edge'` で edge runtime 化済。
- `src/lib/repositories` には `node:fs` を使わない GitHub Contents API driver (`github` driver) を実装済 (Phase 2a/2b)。
- `yarn build:cf` (`next build && npx @cloudflare/next-on-pages`) は edge runtime エラーを出さずに完走する。
- 残りはランタイムの env (`REPOSITORY_DRIVER=github` + GitHub PAT) を Cloudflare dashboard 側で設定するのみ。
- Phase 2 完了後の **PR preview deployment は ようやく green** になる見込み (これまでは Edge Runtime エラーで赤かった)。

## 必要な Cloudflare 環境変数 (Settings → Environment variables)

Cloudflare Pages の dashboard で
**Project "west-portfolio" → Settings → Environment variables** に登録する。
**Production / Preview 両方に同じ値を入れる** (Preview を別 env にしたい場合は差分のみ調整)。

### Plain text (非 secret)

| 変数 | 値 (例) | 用途 |
| --- | --- | --- |
| `REPOSITORY_DRIVER` | `github` | **本番では必ず `github`**。`json` だと `node:fs` 起動で 500。`wrangler.toml` の `[vars]` で default は github にしているが、dashboard 上でも明示しておくと安全。 |
| `GITHUB_OWNER` | `nishi240masa` | コミット先リポジトリ owner |
| `GITHUB_REPO` | `my-portfolio` | コミット先リポジトリ名 |
| `GITHUB_BRANCH` | `develop` (または `main`) | admin から書き込まれるコンテンツのコミット先ブランチ |
| `NEXT_PUBLIC_SITE_URL` | `https://west-portfolio.pages.dev` | canonical URL (metadataBase / robots / sitemap で使用) |
| `NODE_VERSION` | `20` | ビルド時 Node version |

### Encrypt (secret)

| 変数 | 値 | 用途 |
| --- | --- | --- |
| `GITHUB_TOKEN` | fine-grained PAT | `nishi240masa/my-portfolio` の **Contents: Read and write** 権限が必要。GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens から発行する。Classic PAT を使う場合は `repo` scope 全部。 |
| `AUTH_SECRET` | `openssl rand -base64 32` の出力 | NextAuth v5 の署名キー |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | `/admin` ログイン用 |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | `/admin` ログイン用 |
| `ADMIN_EMAILS` | `nishi240masa@gmail.com` (カンマ区切り) | `/admin` アクセス許可リスト |

> **重要**: `GITHUB_TOKEN` などの secret は `wrangler.toml` の `[vars]` には **絶対に書かない**。`wrangler.toml` は public リポジトリにコミットされるため漏洩する。dashboard の Environment variables (Encrypt 指定) のみで管理する。

## Cloudflare dashboard 側で確認すべきビルド設定

| 項目 | 値 |
| --- | --- |
| Build command | `yarn build:cf` |
| Build output directory | `.vercel/output/static` |
| Root directory | (空) |
| Project name | `west-portfolio` |
| Compatibility flags | `nodejs_compat` (`wrangler.toml` で指定済) |

`wrangler.toml` の `name` も `west-portfolio` (CF dashboard 上のプロジェクト名) と合わせてある。

## 設定後の確認方法

1. Cloudflare dashboard → **Deployments** から最新の deployment を開く。
2. **Functions** タブで edge function が複数 (Phase 2 完了時点で `/admin/*` `/api/admin/*` 等) 認識されていることを確認する。
3. デプロイ URL (`https://west-portfolio.pages.dev` または PR preview URL) で:
   - `/` `/home` `/production` `/profile` `/skill` が 200 で返ること
   - `/admin/login` で Google OAuth に飛び、ログイン後 `/admin/home` が見えること
   - `/admin/profile` 等で値を編集 → 保存 → 数秒後に `GITHUB_OWNER/GITHUB_REPO` の `GITHUB_BRANCH` に commit が出ること
4. PR を 1 つ作って Cloudflare Pages の preview deployment が **緑** になることを確認する (Phase 2 完了後、初めて緑になる)。

## ローカル再現コマンド

```bash
yarn build:cf
```

エラー無く完走し、`.vercel/output/static` 配下に成果物が出れば OK。

ランタイム挙動を CF Pages 相当で確認したい場合:

```bash
npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat
```

(`REPOSITORY_DRIVER=github` などは `.dev.vars` または `--var` で渡す。)

## 関連 PR / Phase

- Phase 2a: GitHub Contents API driver 実装
- Phase 2b: repositories factory に github driver 追加
- Phase 2c: admin pages + Server Actions + `/api/admin/*` を edge runtime に (`aa97632`)
- Phase 2d-1: `node:fs` ガードを追加し、edge runtime 上で json driver が動かない場合は明示的に失敗
- Phase 2d-2 (本 PR): env strategy / CF dashboard secrets 手順を文書化
