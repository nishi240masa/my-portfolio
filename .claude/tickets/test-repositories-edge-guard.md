# test-repositories-edge-guard

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `test/repositories-edge-guard`
- **base**: `develop`
- **PR title**: `test(repositories): edge guard の回帰テスト追加`
- **依存**: PR #34 (Phase 2d-1: `assertEdgeCompat` 追加) が develop に入っていること
- **想定 reviewer 観点**: テスト網羅性 / 回帰防止 / scope 厳守

## ゴール

PR #34 reviewer の minor 指摘「regression test がない」を解消する。
`assertEdgeCompat` の動作を unit test で保証し、今後の barrel 内
factory 改修で guard が外れても気付けるようにする。

## 変更ファイル (これ以外は触らない)

- `src/lib/repositories/__tests__/index.test.ts` (新規) — guard の 3 ケース
  × 5 factory を網羅。
- `.claude/tickets/test-repositories-edge-guard.md` (新規) — 本仕様 SSOT。

## 禁止事項

- `src/lib/repositories/index.ts` の **実装変更** (テストのみ追加)。
- `src/lib/repositories/{json,github,sync.ts}` の変更。
- `src/app/admin/**` / `src/app/api/**` の変更。
- `yarn.lock` 変更 (新規 dev dep 追加禁止)。

## テストケース

`describe('repositories index', ...)` 配下に以下 3 ケースを実装する:

1. **node + json driver** (= 通常 dev): `NEXT_RUNTIME !== 'edge'`、
   `REPOSITORY_DRIVER=json` で 5 factory が **throw しない**。
2. **edge + json driver**: `NEXT_RUNTIME=edge`、`REPOSITORY_DRIVER=json` で
   5 factory が **すべて Error を throw** する (driver 切替を促す
   エラーメッセージを含む)。
3. **edge + github driver**: `NEXT_RUNTIME=edge`、`REPOSITORY_DRIVER=github`
   + GITHUB_TOKEN/OWNER/REPO のダミーをセットで **throw しない**。

## 実装ポイント

- `process.env` を `beforeEach` / `afterEach` で snapshot して restore する。
  `jest.isolateModules` 経由で `index.ts` を毎回再 require し、module-local
  state (`envAsserted` flag) をリセットする。
- github driver 経路は `assertGitHubEnv` が走るため、TOKEN/OWNER/REPO の
  dummy 値が必要。
- 実際の network 呼び出しは行わない (factory 取得まで)。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
```

- 新規テストが全 pass する。既存テストは pass を維持。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "test(repositories): edge guard の回帰テスト追加 (Phase 2d follow-up)"
git push -u origin test/repositories-edge-guard
gh pr create --base develop --head test/repositories-edge-guard \
  --title "test(repositories): edge guard の回帰テスト追加" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] `src/lib/repositories/index.ts` の実装は変更されていない
- [ ] テストは 3 ケース × 5 factory を網羅
- [ ] `process.env` がテスト間で漏れていない (beforeEach/afterEach で restore)
- [ ] `jest.isolateModules` で module-local state がリセットされている
- [ ] github driver ケースで TOKEN/OWNER/REPO の dummy がセットされている
