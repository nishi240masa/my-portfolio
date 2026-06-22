# fix-repositories-edge-runtime-guard

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `fix/repositories-edge-runtime-guard`
- **base**: `develop`
- **PR title**: `fix(repositories): edge runtime + json driver の partial failure を明示的 throw (Phase 2d-1)`
- **依存**: PR #32 (Phase 2c: admin pages + Server Actions + api/admin の edge runtime 化) が develop に入っていること
- **想定 reviewer 観点**: アーキテクト / Edge runtime 互換 / 防御的プログラミング

## ゴール

Phase 2c reviewer の major 指摘解消。`nodejs_compat` flag が有効な CF Pages edge
runtime 下でも、json driver は `node:fs` の `readFileSync` 等を partial にしか
shim できず、不定箇所で失敗してしまう。この failure を runtime の不定箇所では
なく **factory 呼び出し時点で明示的に throw** することで fail-fast 化し、誤った
組み合わせを誘導メッセージ付きで防ぐ。

## 変更ファイル (これ以外は触らない)

- `src/lib/repositories/index.ts` — 各 async factory (`getHomeRepo` /
  `getProfileRepo` / `getSkillsRepo` / `getProductionRepo` / `getArticleRepo`)
  の冒頭に `assertEdgeCompat(driver)` 呼び出しを追加。private helper として
  同ファイル内に定義する。
- `.claude/tickets/fix-repositories-edge-runtime-guard.md` (新規) — 本仕様 SSOT。

## 禁止事項

- `src/lib/repositories/sync.ts` — Phase 2a で確定済みのため触らない。
- `src/lib/repositories/json/**` / `src/lib/repositories/github/**` — driver
  実装の中身は変更しない。本 PR は呼び出し側の guard 追加のみ。
- `src/app/admin/**` / `src/app/api/**` — admin / api route の変更は別 PR。
- `yarn.lock` — 依存は変えない。

## 実装ポイント

### guard 関数の仕様

```ts
function assertEdgeCompat(driver: string): void {
  if (process.env.NEXT_RUNTIME === 'edge' && driver === 'json') {
    throw new Error(
      'REPOSITORY_DRIVER=json (default) is not edge-compatible. ' +
        'Set REPOSITORY_DRIVER=github with GITHUB_TOKEN/OWNER/REPO/BRANCH env, ' +
        'or run in node runtime (e.g., yarn dev).',
    );
  }
}
```

- `NEXT_RUNTIME` は Next.js が edge runtime 内で `'edge'` を、node runtime 内で
  `'nodejs'` (もしくは undefined) をセットする標準環境変数。
- 既存の `ensureEnvForDriver(driver)` の **直前** に呼び出すこと。env
  validation より早く失敗させ、driver 選択そのものが間違っていることを
  最優先で通知するため。
- module load 時の副作用 (top-level IIFE) にはしない。テスト時にも安全に
  import できるよう、各 factory 内で都度評価する。

### なぜ partial failure になるのか

CF Pages の `nodejs_compat` flag は `node:fs` の API surface を一部のみ shim
する。`promises.readFile` 等は動くが、本リポの json driver が使う同期 API
(`readFileSync` / `existsSync` 等) は no-op か throw になり、しかも throw
タイミングが driver instance method の中なので、scope ページの初回 SSR の
不定箇所で失敗してしまう。本 guard はその不定性を排除する。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
NEXT_PUBLIC_SITE_URL=https://example.com yarn build:cf 2>&1 | tail -10
```

- node runtime での既存 build / test は全て green を維持。
- `yarn build:cf` も引き続き完全 green (admin pages は github driver 設定下で
  動く想定; 本 guard の throw は実際に発火しないこと)。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "fix(repositories): edge runtime + json driver の partial failure を明示的 throw に (Phase 2d-1)"
git push -u origin fix/repositories-edge-runtime-guard
gh pr create --base develop --head fix/repositories-edge-runtime-guard \
  --title "fix(repositories): edge runtime + json driver の partial failure を明示的 throw (Phase 2d-1)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] 仕様通り、全 5 factory に `assertEdgeCompat(driver)` が追加されている
- [ ] `sync.ts` / json driver / github driver / admin / api / yarn.lock に
      変更が無いこと (scope 厳守)
- [ ] `NEXT_RUNTIME === 'edge' && driver === 'json'` の条件のみで throw する
      (false positive で node runtime build を壊さない)
- [ ] エラーメッセージが driver 切替方法を具体的に案内している
- [ ] 既存破壊 (import 経路、型、export 名、関数シグネチャ) が無い
