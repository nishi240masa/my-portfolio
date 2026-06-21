# refactor-repositories-barrel-lazy

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `refactor/repositories-barrel-lazy`
- **base**: `develop`
- **PR title**: `refactor(repositories): json driver を lazy import 化 (Phase 2a)`
- **依存**: PR #28 が develop に入っていること (公開ルートの edge 化下地)
- **想定 reviewer 観点**: アーキテクト / Edge runtime bundling / 後方互換性

## ゴール

Phase 2 admin epic の基盤。`src/lib/repositories/index.ts` の barrel eager import が
JSON driver (`node:fs` 依存) を edge bundle に混入させている問題を解消する。
async factory + lazy `await import()` を導入し、`unstable_cache` wrapper を lazy 経路
に切り替えることで、cached wrapper を import する公開ページの edge SSR bundle から
`node:fs` static dep を排除する。

これにより、後続 PR (Phase 2c) で admin/api ルートを edge runtime 化する道が開ける。

## 位置づけ

- Phase 2a: 本 PR (barrel restructure — lazy 経路を整備)
- Phase 2b: 認証/CSRF を edge 互換に migrate (別 PR)
- Phase 2c: admin/api ルートを async factory 経由に書き換え、`runtime = 'edge'` を付与

## Rework: 物理分割で eager / lazy を確実に分離

初版は同一ファイル (`src/lib/repositories/index.ts`) の top-level に
static `import { JsonXxx }` と factory 内 `await import('./json/...')` を共存
させていたが、reviewer から「webpack は dynamic import を static 側に寄せて
bundle するため lazy chunk として切り出されない可能性が高い」と major finding。

そのため**物理分割**で構造を整理した:

| ファイル | 責務 | eager import |
|---|---|---|
| `src/lib/repositories/sync.ts` (新規) | sync exports (`homeRepo` 等) + IIFE で env 検証 | JsonXxx / GitHubXxx を **eager** に static import (node runtime 専用) |
| `src/lib/repositories/index.ts` (改修) | async factory (`getHomeRepo` 等) + cached wrapper (`getHomeCached` 等) | **eager import ゼロ**。driver 実装は `await import()` のみで参照 |

これにより webpack には index.ts は「driver 実装を持たない pure な wrapper
モジュール」として見え、`await import('./json/...')` が真の lazy chunk として
切り出される。edge bundle に json driver が混入しなくなる。

## 変更ファイル (これ以外は触らない)

- `src/lib/repositories/sync.ts` (新規) — sync exports + eager imports
- `src/lib/repositories/index.ts` (改修) — async factories + cached wrappers のみ、eager import 排除
- `src/app/sitemap.ts` — `from '@/lib/repositories/sync'` に切替
- `src/app/admin/page.tsx` / `home/page.tsx` / `profile/page.tsx` / `skill/page.tsx`
  / `productions/page.tsx` / `productions/[id]/page.tsx` — sync import 経路を `/sync` に切替
- `src/app/admin/_actions/{home,profile,skills,productions}.ts` — 同上
- `src/app/api/admin/{home,profile,skills,productions,productions/[id]}/route.ts` — 同上
- `src/app/layout.tsx` — `profileRepo` (sync) → `getProfileCached` (cached) に切替
- `src/app/(use-header)/production/(use-production)/[id]/page.tsx` — 同上
- `.claude/tickets/refactor-repositories-barrel-lazy.md` — 本仕様 SSOT

## 禁止事項

- `src/lib/repositories/{json,github}/` 内部実装 — 挙動変更なし
- `src/lib/schemas/` — 別 scope
- ライブラリ追加 (yarn.lock 不変)
- 公開ページの runtime 変更 (PR #28 で済)
- admin の **挙動** 変更 (import 経路の付け替えのみ)

## 実装ポイント

### 1. sync.ts に sync exports を集約

```ts
// src/lib/repositories/sync.ts
import { JsonHomeRepository } from './json/jsonHomeRepository';
import { GitHubHomeRepository } from './github';
// ...
const assertedDriver = (() => { /* env 検証 */ })();
export const homeRepo = makeHomeRepo(); // 等
```

- 既存の sync API は完全互換 (admin/api は import 経路のみ変更)
- `@deprecated` コメントは外す (sync.ts は active な API)

### 2. index.ts は async factory + cached wrapper のみ

```ts
// src/lib/repositories/index.ts
import { unstable_cache } from 'next/cache';
import type { ... } from './types';
// **eager import なし**

export async function getHomeRepo() {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubHomeRepository');
    return new m.GitHubHomeRepository();
  }
  const m = await import('./json/jsonHomeRepository');
  return new m.JsonHomeRepository();
}

export const getHomeCached = unstable_cache(
  async () => (await getHomeRepo()).get(),
  ['home'],
  { tags: ['home'] },
);
```

- `getHomeRepo` / `getProfileRepo` / `getSkillsRepo` / `getProductionRepo`
  / **`getArticleRepo` (reviewer M2 解消で追加)** の 5 つを export
- `assertGitHubEnv` は module-load 時の IIFE ではなく、各 factory 呼び出し時
  に 1 回だけ走る `ensureEnvForDriver` に移動 (module-load 副作用排除、
  reviewer minor3 解消)
- cached wrappers の interface は不変 (公開ページの diff ゼロ)

### 3. consumer 側の import 経路更新

- admin / api / sitemap → `from '@/lib/repositories/sync'`
- layout.tsx / production/[id]/page.tsx (公開ルートと共有 / 利用) →
  `getProfileCached` (cached wrapper) を使う

### 4. 検証ポイント (empirical)

- `yarn build:cf` の warning から `/home` `/profile` `/skill` `/production`
  `/production/[id]` `/articles` `/articles/[slug]` `/journal` `/contact`
  `/en` が edge required list に **絶対に出ない** こと
- admin (8) + api/admin (5) + api/auth (1) = **14 ルートのみ** が残る期待
- 通常 `yarn build` 成功

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -40
```

## レビュー観点 (チェックリスト)

- [ ] sync.ts と index.ts が物理分割されている (index.ts に eager import ゼロ)
- [ ] async factory のシグネチャが `Promise<XxxRepository>` を返す
- [ ] cached wrapper の interface は不変 (call site 変更なし)
- [ ] admin / api / sitemap の sync import 経路が `/sync` に切替済み
- [ ] layout.tsx / production/[id]/page.tsx の profileRepo 使用が cached wrapper に置換済み
- [ ] `getArticleRepo()` が追加されている
- [ ] `assertGitHubEnv` が module-load 時 IIFE ではなく factory 内 lazy 検証
- [ ] `yarn build:cf` の警告から公開ページが消えている (empirical evidence)
- [ ] 通常 build / lint / test green
