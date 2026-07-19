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
> ただし **本番 CF Pages の PR preview deployment が green になるかは別問題** で、後述の dashboard secrets 設定が揃い、branch protection を通過して deployment が走ったときに反映される見込み。

## 必要な Cloudflare 環境変数 (Settings → Environment variables)

Cloudflare Pages の dashboard で
**Project "west-portfolio" → Settings → Environment variables** に登録する。
**Production / Preview 両方に同じ値を入れる** (Preview を別 env にしたい場合は差分のみ調整)。

> **重要**: Git-connected な Cloudflare Pages プロジェクトでは、ランタイム env としては **CF dashboard の Environment variables が SSOT**。`wrangler.toml` の `[vars]` は wrangler ベースの deploy / ローカル `wrangler pages dev` 用の補助的なもので、本番ランタイムでは dashboard 側の値が優先される。`wrangler.toml` の `[vars]` は「dashboard 設定漏れ時の保険」程度に位置付ける。

### Plain text (非 secret)

| 変数 | 値 (例) | 用途 |
| --- | --- | --- |
| `REPOSITORY_DRIVER` | `github` | **本番では必ず `github`**。`json` だと `node:fs` 起動で 500 (Phase 2d-1 の guard で明示的に throw)。`wrangler.toml` の `[vars]` で default は `github` にしているが、Git-connected Pages では dashboard 設定が SSOT のため dashboard 上でも明示しておくこと。 |
| `GITHUB_OWNER` | `nishi240masa` | コミット先リポジトリ owner |
| `GITHUB_REPO` | `my-portfolio` | コミット先リポジトリ名 |
| `GITHUB_BRANCH` | `develop` (または `main`) | admin から書き込まれるコンテンツのコミット先ブランチ |
| `NEXT_PUBLIC_SITE_URL` | `https://west-portfolio.pages.dev` | canonical URL (metadataBase / robots / sitemap で使用) |
| `NODE_VERSION` | `20` | **CF dashboard の build-time env**。`.vercel/output/static` を生成する build job 用 Node.js のバージョン指定で、ランタイムには関係しない (CF Pages の build container 設定)。`.env.example` には登場しないことに注意。 |

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
2. **Functions** タブで Edge Function が **15 個程度** (admin 8 + api/admin 5 + api/auth 1 + opengraph-image 1) 認識されていることを確認する。
3. デプロイ URL (`https://west-portfolio.pages.dev` または PR preview URL) で:
   - `/` `/home` `/production` `/profile` `/skill` `/articles` `/journal` `/contact` が 200 で返ること (これらは static asset 配信)
   - `/admin/login` で Google OAuth に飛び、ログイン後 `/admin/home` が見えること (Edge Function 動作)
   - `/admin/profile` 等で値を編集 → 保存 → 数秒後に `GITHUB_OWNER/GITHUB_REPO` の `GITHUB_BRANCH` に commit が出ること
4. PR を 1 つ作って Cloudflare Pages の preview deployment の状態を確認する。
   - これまで赤かった原因 (公開ページ含む全体 edge 化試行で `node:fs` がバンドル) は Phase 2a (json driver lazy import) + Phase 2c (admin/API のみ edge 化) で解消されているはず。
   - ただし本番 CF Pages 上で green になるには **dashboard secrets 設定の完了 + branch protection 通過** が必要。

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
