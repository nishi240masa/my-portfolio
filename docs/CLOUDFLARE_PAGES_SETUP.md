# Cloudflare Pages デプロイ設定について

## 現状

本プロジェクトは現在、以下の理由により **Cloudflare Pages では動作しません**。
Vercel または Node.js ランタイムをサポートする他プラットフォームでのデプロイを推奨します。

## 失敗の真因

`yarn build:cf` (`next build && npx @cloudflare/next-on-pages`) を実行すると、以下のエラーで失敗します:

```
⚡️ ERROR: Failed to produce a Cloudflare Pages build from the project.
⚡️
⚡️ 	The following routes were not configured to run with the Edge Runtime:
⚡️ 	  - /admin/home
⚡️ 	  - /admin/login
⚡️ 	  - /admin/productions/[id]
⚡️ 	  - /admin/productions/new
⚡️ 	  - /admin/productions
⚡️ 	  - /admin/profile
⚡️ 	  - /admin/skill
⚡️ 	  - /admin
⚡️ 	  - /api/admin/home
⚡️ 	  - /api/admin/productions/[id]
⚡️ 	  - /api/admin/productions
⚡️ 	  - /api/admin/profile
⚡️ 	  - /api/admin/skills
⚡️ 	  - /api/auth/[...nextauth]
⚡️ 	  - /home
⚡️ 	  - /production/[id]
⚡️ 	  - /production
⚡️ 	  - /profile
⚡️ 	  - /skill
```

### 背景

`feat: implement admin dashboard with content management and authentication via JSON repositories` (d080cf6) で導入された admin ダッシュボードは、`src/lib/repositories/json/jsonFile.ts` 経由で `node:fs` を使ってサーバー側でファイル読み書きを行います。これは Node.js ランタイム専用の API であり、Cloudflare Pages の Edge Runtime では使用できません。

そのため、各 page / route には明示的に以下が指定されています:

```ts
export const runtime = 'nodejs';
```

`@cloudflare/next-on-pages` は **全ての非静的ルートが `'edge'` ランタイム** であることを要求するため、ビルド時点でエラーになります。

## 対処方法 (2 通り)

### 1. Cloudflare Pages の自動 PR プレビューを無効化する (推奨・短期)

Cloudflare dashboard で以下のいずれかの操作を行ってください:

- プロジェクト "west-portfolio" の **Settings → Builds & deployments → Automatic deployments** で `Preview` を無効化
- もしくは GitHub App のリポジトリ連携を解除

`.github/workflows/deploy.yml` の Cloudflare Pages デプロイ Job も、本アーキテクチャでは失敗します。Vercel に統一する場合はこの workflow も削除を検討してください。

### 2. Cloudflare Pages 用にアーキテクチャを移行する (長期)

すべての admin / API ルートを Edge Runtime に対応させる必要があります:

- `node:fs` を使った JSON ファイル永続化を、Cloudflare KV / D1 / R2 へ移行
- `src/lib/repositories/json/jsonFile.ts` を Edge 互換ストレージに置き換え
- 全ルートの `export const runtime = 'nodejs'` を `'edge'` に変更
- `next-auth` の jose 由来の `CompressionStream` / `DecompressionStream` 警告も解消

これは大規模な改修が必要です。

## Cloudflare dashboard 側で確認すべき設定

将来 CF Pages を再度使う場合に必要となる設定値:

| 項目 | 値 |
| --- | --- |
| Build command | `yarn build:cf` |
| Build output directory | `.vercel/output/static` |
| Node version (env var) | `NODE_VERSION=20` |
| Project name | `west-portfolio` |

`wrangler.toml` の `name` も `west-portfolio` (CF dashboard 上のプロジェクト名) と合わせてあります。

## ローカル再現コマンド

```bash
yarn build:cf
```

最後に上記の Edge Runtime エラーが表示されれば、同じ失敗を再現できています。
