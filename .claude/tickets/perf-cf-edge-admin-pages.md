# perf-cf-edge-admin-pages

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `perf/cf-edge-admin-pages`
- **base**: `develop`
- **PR title**: `perf(edge): admin pages + Server Actions + api/admin を edge runtime に (Phase 2c)`
- **依存**: PR #28 (Phase 1, public routes), PR #30 (Phase 2a, repositories barrel 物理分割), PR #31 (Phase 2b, api/auth edge)
- **想定 reviewer 観点**: async factory pattern / edge runtime / node:fs 除去

## ゴール

CF Pages epic 最後の本丸。残り 13 ルート (admin 8 + api/admin 5) を edge runtime に
migrate する。Phase 2a で整備した async factory (`getHomeRepo` / `getProfileRepo`
/ `getSkillsRepo` / `getProductionRepo` / `getArticleRepo`) を使い、admin の sync
export 依存を排除して edge bundle から node:fs を完全に逃がす。

## 位置づけ

- Phase 1: public routes static 化 (#28)
- Phase 2a: repositories barrel 物理分割 (#30)
- Phase 2b: api/auth/[...nextauth] edge runtime 化 (#31)
- Phase 2c: 本 PR — admin pages (10) + Server Actions (4) + api/admin routes (5) を edge runtime に
- Phase 2d (後続): CF dashboard 用 env 設定 docs (REPOSITORY_DRIVER=github)

## 変更ファイル (これ以外は触らない)

### Server Actions (src/app/admin/_actions/)

- `home.ts` / `profile.ts` / `skills.ts` / `productions.ts`
- `import { homeRepo } from '@/lib/repositories/sync'` → `import { getHomeRepo } from '@/lib/repositories'`
- 呼び出しを `const repo = await getHomeRepo(); await repo.update(...)` パターンに
- **注**: `'use server'` ファイルは `runtime` 定数 export を許可しないため、
  Server Action 自身に `runtime = 'edge'` は付けない。代わりに呼び出し元 page の
  `runtime = 'edge'` が edge bundle を生成する経路で edge 化される。

### next.config.mjs (webpack edge fallback)

- admin/api/admin ルート edge 化により、`@/lib/repositories` barrel が lazy import する
  JSON driver (`node:fs` / `node:path` 依存) を webpack edge target が parse しようとし、
  `UnhandledSchemeError` が発生する。
- 解消のため、edge layer でのみ `node:fs` / `node:path` を `commonjs` 形式の external
  として扱う webpack カスタム externals を追加。
- 結果: build 通過 / edge bundle に外部参照だけ残るが、Cloudflare Workers では当該
  module が解決できないため、json driver が誤って呼ばれた場合は明示的に runtime error
  となる (REPOSITORY_DRIVER=github が必須)。

### admin pages (src/app/admin/)

- `layout.tsx` / `page.tsx` / `login/page.tsx`
- `home/page.tsx` / `profile/page.tsx` / `skill/page.tsx`
- `productions/page.tsx` / `productions/[id]/page.tsx` / `productions/new/page.tsx`
- 各 page で `repositories/sync` import を async factory に変更
- `runtime = 'nodejs'` → `runtime = 'edge'`

### api/admin routes (src/app/api/admin/)

- `home/route.ts` / `profile/route.ts` / `skills/route.ts`
- `productions/route.ts` / `productions/[id]/route.ts`
- `runtime = 'nodejs'` → `runtime = 'edge'`
- 内部で `await getXxxRepo()` を呼ぶ

## 禁止事項

- `src/lib/repositories/{json,github,sync.ts,index.ts,types.ts}` の中身変更 (Phase 2a 完了)
- `src/lib/schemas/` の変更
- `src/auth.ts` / `src/middleware.ts` の変更
- `src/app/(use-header)/` の変更 (Phase 1 完了)
- `src/app/api/auth/` の変更 (Phase 2b 完了)
- ライブラリ追加 (yarn.lock 不変)

## 実装ポイント

### async factory pattern への移行

Before:
```ts
import { homeRepo } from '@/lib/repositories/sync';
const data = await homeRepo.get();
```

After:
```ts
import { getHomeRepo } from '@/lib/repositories';
const repo = await getHomeRepo();
const data = await repo.get();
```

### Server Action での 'use server' と runtime

- `'use server'` ディレクティブと `export const runtime = 'edge'` は共存可能
- Server Action 関数自体は edge runtime で動作する

### 懸念点

- json driver の dynamic import は依然 `node:fs` 依存。edge runtime で
  `REPOSITORY_DRIVER=json` を使うと runtime error。本番は
  `REPOSITORY_DRIVER=github` 必須 (Phase 2d で docs)
- dev (`yarn dev`) は node runtime なので `REPOSITORY_DRIVER=json` でも動作する
- async factory は dynamic import → cold start で chunk load が走る

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -40
```

### 期待される build:cf 結果

- edge エラー一覧が **空** になる (admin 13 ルートも edge OK)
- Cloudflare Pages PR preview がついに通る (CF dashboard secrets 設定済の場合)

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "perf(edge): admin pages + Server Actions + api/admin を edge runtime に (Phase 2c)"
git push -u origin perf/cf-edge-admin-pages
gh pr create --base develop --head perf/cf-edge-admin-pages \
  --title "perf(edge): admin pages + Server Actions + api/admin を edge runtime に (Phase 2c)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] admin pages / Server Actions / api/admin routes が全て `runtime = 'edge'` 明示
- [ ] sync export 依存が完全に排除されている
- [ ] async factory pattern で呼び出されている
- [ ] `yarn build:cf` で edge エラー一覧が空 (または 0)
- [ ] 通常 build / lint / test green
- [ ] dev サーバー (yarn dev) で admin 編集が動作 (json driver default)
