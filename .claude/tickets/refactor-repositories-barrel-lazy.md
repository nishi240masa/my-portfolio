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
lazy import + async factory パターンを追加し、`unstable_cache` wrapper を lazy 経路
に切り替えることで、cached wrapper を import する公開ページの edge SSR bundle から
`node:fs` static dep を排除する。

これにより、後続 PR (Phase 2c) で admin/api ルートを edge runtime 化する道が開ける。

## 位置づけ

- Phase 2a: 本 PR (barrel restructure — lazy 経路を整備)
- Phase 2b: 認証/CSRF を edge 互換に migrate (別 PR)
- Phase 2c: admin/api ルートを async factory 経由に書き換え、`runtime = 'edge'` を付与

## 変更ファイル (これ以外は触らない)

- `src/lib/repositories/index.ts` — barrel を lazy 化、async factory を追加、cached wrapper を async factory 経由に切替
- `.claude/tickets/refactor-repositories-barrel-lazy.md` (新規) — 本仕様 SSOT

## 禁止事項

- `src/app/admin/` 配下 — Phase 2c で扱う
- `src/app/api/` 配下 — Phase 2c で扱う
- `src/lib/repositories/{json,github}/` 内部実装 — 挙動変更なし
- `src/lib/schemas/` — 別 scope
- ライブラリ追加 (yarn.lock 不変)
- 公開ページの runtime 変更 (PR #28 で済)

## 実装ポイント

### 1. Async factory を新規 export (lazy import)

```ts
export async function getHomeRepo(): Promise<HomeRepository> {
  if (driver === 'github') {
    const m = await import('./github/githubHomeRepository');
    return new m.GitHubHomeRepository();
  }
  const m = await import('./json/jsonHomeRepository');
  return new m.JsonHomeRepository();
}
```

- 同じパターンで `getProfileRepo` / `getSkillsRepo` / `getProductionRepo` を追加
- `await import()` により、呼び出し側の edge bundle に json driver の static dep が
  含まれなくなる (chunk として動的に loadable な形になる)

### 2. Cached wrappers を async factory 経由に切替

```ts
export const getHomeCached = unstable_cache(
  async (): Promise<HomeContent> => {
    const repo = await getHomeRepo();
    return repo.get();
  },
  ['home'],
  { tags: ['home'] },
);
```

- 既存の sync `homeRepo` 参照を除去し、cached wrapper 内部で async factory を呼ぶ
- 呼び出し側 (`getHomeCached()`) の interface は不変 → 公開ページの diff ゼロ

### 3. Sync exports (legacy) は維持

- `homeRepo` / `profileRepo` / `skillsRepo` / `productionRepo` / `articleRepo` は
  そのまま eager construction で残す
- admin pages / api routes / `layout.tsx` の `profileRepo` / `sitemap.ts` の `productionRepo`
  が依然これを使用 (Phase 2c で個別に移行)
- これらは node runtime で動くため `node:fs` を含んでよい

### 4. Edge bundle 改善の検証ポイント

- `yarn build:cf` の warning 一覧から `/home` `/profile` `/skill` `/production` `/production/[id]`
  が edge required リストに含まれないこと
- admin/api の 14 ルートは依然エラーとして残る (期待通り、Phase 2c で edge 化)
- 通常 `yarn build` は成功

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -30
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "refactor(repositories): json driver を lazy import 化し edge bundle 混入を回避 (Phase 2a)"
git push -u origin refactor/repositories-barrel-lazy
gh pr create --base develop --head refactor/repositories-barrel-lazy \
  --title "refactor(repositories): json driver を lazy import 化 (Phase 2a)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] async factory のシグネチャが `Promise<XxxRepository>` を返す
- [ ] cached wrapper の interface は不変 (call site 変更なし)
- [ ] sync exports (`homeRepo` 等) は残置されている
- [ ] admin/api/layout/sitemap など禁止 scope を触っていない
- [ ] `yarn build:cf` の警告から公開ページが消えている
- [ ] 通常 build / lint / test green
