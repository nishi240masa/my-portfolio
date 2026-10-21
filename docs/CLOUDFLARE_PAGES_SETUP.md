# Cloudflare Pages デプロイ設定について

## アーキテクチャ全体像 (Phase 2 完了時点)

本プロジェクトは Cloudflare Pages 上では **二経路戦略 (hybrid)** で動作する。
「全ルートを edge runtime に移行した」訳ではないことに注意。

### 公開ページ: SSG / ISR (default = Node runtime)

以下の公開ルートは **`export const runtime = 'edge'` を付けていない** (= Next.js default の Node runtime + `revalidate` ベースの ISR / もしくは `generateStaticParams` ベースの SSG):

- `/home`
- `/profile`
- `/skill`
- `/production`, `/production/[id]`
- `/articles`, `/articles/[slug]`
- `/journal`
- `/contact`
- `/en` (locale variant)

これらはビルド時に静的化されているため、Cloudflare Pages 上では **static asset として配信される** (edge function ではない)。SSG 済 HTML は edge runtime を必要としないため CF Pages 互換性は static で担保される。

> **なぜ edge 化していないか**: `@/lib/repositories` barrel 経由で `JsonProductionRepository` などが static import されると、edge bundle に `node:fs` が混入する。barrel の lazy/conditional 化 (Phase 2a `f217af8`) は完了しているが、公開ページについては SSG/ISR のままで CF 互換が成立しているため敢えて edge 化していない。`/production/[id]` は Next.js 15 の制約上 `generateStaticParams` と `runtime = 'edge'` を併用できないという制限もあり、SSG が採用されている。

### Admin / 認証 / OG 画像: Edge runtime

以下のルートは **`export const runtime = 'edge'`** が明示されており、CF Pages 上では **Edge Function** として動作する:

- `/admin/*` (8 ルート: `/admin`, `/admin/home`, `/admin/login`, `/admin/profile`, `/admin/skill`, `/admin/productions`, `/admin/productions/new`, `/admin/productions/[id]` + layout)
- `/api/admin/*` (5 ルート: `home`, `profile`, `skills`, `productions`, `productions/[id]`)
- `/api/auth/[...nextauth]`
- `/production/[id]/opengraph-image` (force-static + runtime='edge' で **static asset** として焼かれる)

### CF dashboard で確認できる指標

| 指標 | 期待値 |
| --- | --- |
| Static asset 数 | 公開ページの SSG/ISR 出力分 (HTML + assets) が `.vercel/output/static` 配下に出る |
| Edge Function 数 | **15 程度** (admin 8 + api/admin 5 + api/auth 1 + opengraph-image 1) |

> Phase 2c の reviewer 確認 (PR #32) で `yarn build:cf` 出力末尾において **「Edge Function Routes 15 個生成、`The following routes were not configured to run with the Edge Runtime` の list が完全に空」** であることが確認済。これにより CF Pages 上で動作する条件が成立。
>
> ただし CF Pages 上で動的ルートが動くかは別問題で、後述の dashboard secrets 設定 (Production / Preview) が揃っていることが前提。PR preview は `preview.yml` (後述) が Actions からデプロイする。

## デプロイ経路 (GitHub Actions に一本化)

CF Pages へのデプロイは **GitHub Actions のみ** で行う (CF Pages の Git 連携ビルドは Production / Preview とも OFF)。

| 契機 | workflow | CF Pages 環境 | `--branch` |
| --- | --- | --- | --- |
| PR (base: `develop` / `main`) の opened / synchronize / reopened | `.github/workflows/preview.yml` | **Preview** | PR の head ref (例 `ci/foo` → alias `ci-foo.west-portfolio.pages.dev`) |
| `main` への push | `.github/workflows/deploy.yml` | **Production** | `main` (production branch を明示) |

> **Vercel ホスティングは廃止済** (2026-10)。本番・preview とも Vercel は使わない。`.vercel/output/static` は next-on-pages の出力 dir 名、devDependency `vercel@47.0.4` は next-on-pages が内部で `vercel build` を呼ぶためのもので、Vercel へのデプロイとは無関係 (削除しない)。

### Production (`deploy.yml`)

- トリガ: `main` への push
- 流れ: `test` job (lint + test + `yarn build`) → `deploy` job (`yarn build:cf` → `cloudflare/wrangler-action` で `wrangler pages deploy .vercel/output/static --project-name=west-portfolio --branch=main`)
- Node: `.nvmrc` (= `24`) + `actions/setup-node` の `check-latest: true` で常に 24.x 最新 patch (security fix 込み)
- 本番 canonical URL: **`https://w3st.net`** (`deploy.yml` で `NEXT_PUBLIC_SITE_URL` を build 時に注入。Actions の repository variable `NEXT_PUBLIC_SITE_URL` があればそちらを優先)

### Preview (`preview.yml`)

- トリガ: `develop` / `main` 向け PR の opened / synchronize / reopened (`concurrency: preview-<PR番号>` で同一 PR の古い実行は cancel)
- 流れ: `yarn build:cf` (`NEXT_PUBLIC_SITE_URL=https://w3st.net` = canonical は本番を指し、preview の重複インデックスを避ける) → `wrangler pages deploy ... --branch=<head ref>` → Preview URL (branch alias / deployment URL) を PR に **1 コメント** で通知 (marker `<!-- cf-pages-preview -->` 付きコメントを push ごとに更新)
- Node は deploy.yml と同じく `.nvmrc` + `check-latest: true`
- **fork PR / Dependabot PR は skip** (GitHub が secrets を渡さないため)。job が `skipped` になるのは正常
- **head が `main` の PR (main → develop の back-merge 等) も skip** (`--branch=main` が Production デプロイになるため。Production は deploy.yml のみ)
- workflow の `permissions` は `contents: read` / `deployments: write` / `pull-requests: write` のみ
- 動的ルート (admin / API / auth) を Preview で試すには、CF dashboard の **Preview 環境** にも runtime Secret (`GITHUB_TOKEN` / `ADMIN_EMAILS` / `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` など、後述) を登録しておく。公開ページ (static asset) だけなら不要
  - Google OAuth を Preview で使う場合は、OAuth client の承認済みリダイレクト URI に Preview の URL を追加する必要がある

### ロールバック

- Cloudflare dashboard → **Project "west-portfolio" → Deployments** → 戻したい Production deployment の「…」→ **Rollback to this deployment**
- 恒久対応は `main` に revert commit を push (deploy.yml が再デプロイする)

### CF Pages の Git 連携 (自動ビルド) は OFF にする

CF Pages の Git 連携ビルドは使わない (二重デプロイになり、かつ build image の Node / env が Actions と食い違って失敗し続けるため)。

- Cloudflare dashboard → **Project "west-portfolio" → Settings → Builds → Branch control** で、Production の自動デプロイ (automatic deployments) を無効化し、**Preview branches: None** にする
- PR preview は上記 `preview.yml` が担う (Git 連携の Preview ビルドは Preview 環境に `GITHUB_TOKEN` が無いと `/sitemap.xml` の page data 収集で失敗し、build image の Node も `.nvmrc` の最新 patch を担保できないため使わない)

### 必要な GitHub Secrets (Settings → Secrets and variables → Actions)

| Secret | 値 | 備考 |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | CF API Token | **権限は Account / Cloudflare Pages / Edit のみ** (My Profile → API Tokens → Create Custom Token)。Zone 権限等は付けない |
| `CLOUDFLARE_ACCOUNT_ID` | CF Account ID | dashboard 右サイドバー / Workers & Pages の Overview に表示 |

## 必要な Cloudflare 環境変数 (runtime)

`wrangler.toml` に `pages_build_output_dir` があるため、CF Pages の設定は **wrangler.toml が SSOT** で、dashboard では **Secret しか登録できない** (plain text 環境変数は `wrangler.toml` の `[vars]` が担う)。本プロジェクトの方針は以下:

| 置き場所 | 変数 |
| --- | --- |
| `wrangler.toml` の `[vars]` | `REPOSITORY_DRIVER` **のみ** |
| CF dashboard の **Secret** | 上記以外すべて (`GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` / `NEXT_PUBLIC_SITE_URL` / `GITHUB_TOKEN` / `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` / `ADMIN_EMAILS`) |

- Secret は **Project "west-portfolio" → Settings → Variables and Secrets** で **Production / Preview の両方** に登録する。CLI なら (wrangler 4 の `pages secret put` は Production が対象で、Preview 指定オプションは無いため Preview は dashboard で登録):
  ```bash
  npx wrangler pages secret put <NAME> --project-name west-portfolio
  ```
- **`[vars]` と同名の Secret は作らない** (= `REPOSITORY_DRIVER` を Secret に登録しない)。同名だと値の出所が曖昧になる。
- デプロイを Actions (`wrangler pages deploy`) に一本化しても、これらは Edge Function (admin / API / auth) の **実行時** に参照されるため、dashboard への登録は引き続き必要。

### `wrangler.toml` `[vars]`

| 変数 | 値 | 用途 |
| --- | --- | --- |
| `REPOSITORY_DRIVER` | `github` | **本番では必ず `github`**。`json` だと `node:fs` 起動で 500 (Phase 2d-1 の guard で明示的に throw)。 |

### dashboard Secret (Production / Preview 両方)

| 変数 | 値 | 用途 |
| --- | --- | --- |
| `GITHUB_OWNER` | `nishi240masa` | コミット先リポジトリ owner |
| `GITHUB_REPO` | `my-portfolio` | コミット先リポジトリ名 |
| `GITHUB_BRANCH` | `main` (feeds bot と同じ。オーナー判断で `develop` も可) | admin から書き込まれるコンテンツのコミット先ブランチ |
| `NEXT_PUBLIC_SITE_URL` | `https://w3st.net` | canonical URL (metadataBase / robots / sitemap で使用)。**`NEXT_PUBLIC_*` はビルド時にバンドルへ埋め込まれる** ため、本番ビルドでは `deploy.yml` の `env` (`vars.NEXT_PUBLIC_SITE_URL \|\| 'https://w3st.net'`) が効く。dashboard 側はサーバ実行時に `process.env` を読む経路の保険。 |
| `GITHUB_TOKEN` | fine-grained PAT | `nishi240masa/my-portfolio` の **Contents: Read and write** 権限が必要。GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens から発行する。Classic PAT を使う場合は `repo` scope 全部。 |
| `AUTH_SECRET` | `openssl rand -base64 32` の出力 | NextAuth v5 の署名キー |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | `/admin` ログイン用 |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | `/admin` ログイン用 |
| `ADMIN_EMAILS` | `nishi240masa@gmail.com` (カンマ区切り) | `/admin` アクセス許可リスト |

> **重要**: secret は `wrangler.toml` の `[vars]` には **絶対に書かない**。`wrangler.toml` は public リポジトリにコミットされるため漏洩する。

> **`NODE_VERSION` は dashboard に登録しない**。CF の build image では `NODE_VERSION` が `.nvmrc` より優先されるため、登録すると `.nvmrc` (SSOT) と食い違う。そもそも build は Actions 側で行い、Git 連携ビルドは OFF にする (上記)。既に登録済みなら削除する。

## Cloudflare dashboard 側で確認すべきビルド設定

> Git 連携の自動ビルドは OFF にするため、以下は参考値 (Actions の `deploy.yml` と同条件)。

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
2. **Functions** タブで Edge Function が **15 個程度** (admin 8 + api/admin 5 + api/auth 1 + opengraph-image 1) 認識されていることを確認する。
3. デプロイ URL (`https://west-portfolio.pages.dev` または PR preview URL) で:
   - `/` `/home` `/production` `/profile` `/skill` `/articles` `/journal` `/contact` が 200 で返ること (これらは static asset 配信)
   - `/admin/login` で Google OAuth に飛び、ログイン後 `/admin/home` が見えること (Edge Function 動作)
   - `/admin/profile` 等で値を編集 → 保存 → 数秒後に `GITHUB_OWNER/GITHUB_REPO` の `GITHUB_BRANCH` に commit が出ること
4. PR を 1 つ作り、Actions の `Preview Deploy (Cloudflare Pages)` が green になり、PR に Preview URL コメントが付くことを確認する。
   - その URL の `/` が 200 を返すこと。動的ルートまで確認する場合は Preview 環境の runtime Secret 登録が前提。

> **NextAuth v5 + edge の既知制約**: `/api/auth/[...nextauth]` は edge runtime 化済 (Phase 2b)。NextAuth v5 は edge 互換が公式 supported だが、jose / CompressionStream 等の polyfill 警告がビルド時に出る場合がある。実害が出たら個別対応 (Phase 2b/2c で `nodejs_compat` flag 必須が判明している)。

## ローカル再現コマンド

```bash
yarn build:cf
```

エラー無く完走し、`.vercel/output/static` 配下に成果物が出れば OK。
出力末尾の `Edge Function Routes` が 15 件、その下の `The following routes were not configured to run with the Edge Runtime` セクションが空になることも併せて確認する。

ランタイム挙動を CF Pages 相当で確認したい場合:

```bash
npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat
```

`.dev.vars` または `--var` で env を渡す。ローカルで json driver を試したい場合は以下のように override する:

```bash
npx wrangler pages dev .vercel/output/static \
  --compatibility-flag=nodejs_compat \
  --var REPOSITORY_DRIVER:json
```

> `wrangler.toml` の `[vars] REPOSITORY_DRIVER = "github"` がある状態でも、`--var` での override か `.dev.vars` で明示的に上書きできる。dev / test では `.env.example` の方針通り `REPOSITORY_DRIVER=json` が default のため、ローカル `wrangler pages dev` で json driver を試したい場合はこの override が必要。

## 関連 PR / Phase

- **Phase 0 (PR #5, `770d9c0`)**: GitHub Contents API driver (`GithubProductionRepository` 等) を **Layer 0 で別途実装済**。本 epic では既存資産として利用するのみ。
- **Phase 1 (PR #28, `9a5fbc9`)**: 公開ルートの `force-dynamic` 撤廃 + OG 画像 edge 化 (`/production/[id]/opengraph-image`) + 公開ページ SSG/ISR 化。
- **Phase 2a (PR #30, `f217af8`)**: `@/lib/repositories` barrel の物理分割 + json driver の lazy import 化 (`getXxxCached` を async factory に)。
- **Phase 2b (PR #31, `82e8ee5`)**: `/api/auth/[...nextauth]` を edge runtime 化。
- **Phase 2c (PR #32, `aa97632`)**: admin pages + Server Actions + `/api/admin/*` を edge runtime 化。`yarn build:cf` の Edge Function Routes が 15、edge required list が空であることを reviewer 確認済。
- **Phase 2d-1 (PR #34)**: `src/lib/repositories/index.ts` に edge runtime + json driver の組合せを明示的に throw する guard を追加 (Phase 2d-1)。
- **Phase 2d-2 (PR #33, 本 PR)**: `wrangler.toml [vars]` で `REPOSITORY_DRIVER=github` を default 化 + `.env.example` の dev/test=json / 本番=github 二分強化 + CF dashboard secrets 手順 (本ファイル) 整備。
- **Phase 2d-3 (PR #35 予定)**: 残タスクの整合 (PROGRESS / RESUME 反映)。
