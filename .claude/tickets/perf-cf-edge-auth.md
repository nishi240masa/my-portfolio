# perf-cf-edge-auth

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `perf/cf-edge-auth`
- **base**: `develop`
- **PR title**: `perf(edge): api/auth/[...nextauth] を edge runtime に (Phase 2b)`
- **依存**: PR #30 (Phase 2a, repositories barrel 物理分割) が develop に入っていること
- **想定 reviewer 観点**: Edge runtime bundling / next-auth v5 edge-compat / 認証ロジックの非破壊

## ゴール

CF Pages epic Phase 2b。`src/app/api/auth/[...nextauth]/route.ts` を edge runtime に
migrate し、Cloudflare Pages の edge required ルートリストから本ルートを外す。
next-auth v5 (beta) は edge-compat なため、`export const runtime = 'edge'` を付与する
だけで完結する想定。

## 位置づけ

- Phase 2a: repositories barrel 物理分割 (PR #30, develop merged)
- Phase 2b: 本 PR — `api/auth/[...nextauth]` を edge runtime に
- Phase 2c: `admin/*` (8) + `api/admin/*` (5) ルートを edge runtime に (別 PR)

## 変更ファイル (これ以外は触らない)

- `src/app/api/auth/[...nextauth]/route.ts` — `export const runtime = 'edge'` を追加
- `.claude/tickets/perf-cf-edge-auth.md` (新規) — 本仕様 SSOT

## 禁止事項

- `src/auth.ts` のロジック変更 (確認のみ)
- `src/middleware.ts` の変更 (既に edge 互換)
- `src/app/admin/` の変更 (Phase 2c)
- `src/app/api/admin/` の変更 (Phase 2c)
- `src/lib/repositories/` の変更 (Phase 2a 完了)
- ライブラリ追加 (yarn.lock 不変)

## 実装ポイント

### 1. route.ts に runtime 明示

```ts
import { handlers } from '@/auth';

export const runtime = 'edge';

export const { GET, POST } = handlers;
```

next-auth v5 の `handlers` は GET/POST が edge-compat に実装されている。
本ルートは `@/auth` 経由でしか provider/callback を参照しないため、
追加の adapter import 等は不要。

### 2. src/auth.ts の edge 互換確認 (変更しない)

- providers: `next-auth/providers/google` — edge-compat
- callbacks: `signIn` / `session` — env 参照のみ、edge OK
- database adapter: **未使用** (default JWT strategy) — edge OK
- module-load 時の `ADMIN_EMAILS` 解析 — 純 JS、edge OK

### 3. src/middleware.ts の確認 (変更しない)

- middleware は Next.js default で edge runtime
- `auth(req => ...)` 経由で next-auth v5 の edge handler を import
  (v5 では `auth-config` 分離なしで OK)

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -30
```

### 期待される build:cf 結果

- `api/auth/[...nextauth]` が edge エラー一覧から消失
- 残るは `admin/*` (8) + `api/admin/*` (5) = **13 ルートのみ**

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "perf(edge): api/auth/[...nextauth] を edge runtime に (Phase 2b)"
git push -u origin perf/cf-edge-auth
gh pr create --base develop --head perf/cf-edge-auth \
  --title "perf(edge): api/auth/[...nextauth] を edge runtime に (Phase 2b)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] `route.ts` に `export const runtime = 'edge'` が付いている
- [ ] `src/auth.ts` / `src/middleware.ts` に変更なし
- [ ] `yarn build:cf` で `api/auth/[...nextauth]` が消えている (13 ルート残)
- [ ] 通常 build / lint / test green
- [ ] next-auth v5 の edge 互換に関する公式ドキュメント整合
