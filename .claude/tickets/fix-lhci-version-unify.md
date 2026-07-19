# fix-lhci-version-unify

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `fix/lhci-version-unify`
- **base**: `develop`
- **PR title**: `fix(ci): LHCI を yarn lhci に統一 (npx 0.14 と devDeps 0.15 不整合解消)`
- **依存**: PR #12 / #21 (LHCI 導入) が develop に入っていること
- **想定 reviewer 観点**: CI / Performance (LHCI)

## ゴール

PR #12 の reviewer 指摘 ".github/workflows/lhci.yml が `npx @lhci/cli@0.14.x` を実行しているのに、devDependencies は `@lhci/cli@^0.15.1` で固定されている" 不整合を解消する。
CI と local の LHCI バージョンを完全一致させ、再現性とロックファイル安定性を両立させる。

## 変更ファイル (これ以外は触らない)

- `.github/workflows/lhci.yml` — `npx --yes @lhci/cli@0.14.x autorun` → `yarn lhci autorun`
- `.claude/tickets/fix-lhci-version-unify.md` (新規) — 仕様 SSOT

## 禁止事項

- `package.json` / `yarn.lock` — lockfile 安定性のため本 PR では touch しない (`@lhci/cli` の version downgrade は別 PR スコープ)
- 他 workflow ファイル (test.yml 等) — scope 外
- `src/` 配下 — 関係ない
- `@lhci/cli` の major upgrade — 別タスク

## 実装ポイント

- `yarn lhci` は `node_modules/.bin/lhci` (devDeps 経由) を実行するため、必ず `@lhci/cli@^0.15.1` が利用される。
- workflow は既に `actions/setup-node` で `cache: 'yarn'` を指定し、`yarn install --frozen-lockfile` で devDeps を導入している → 追加 setup 不要。
- `autorun` サブコマンドは 0.14 / 0.15 互換 (collect → assert → upload)。設定ファイル (`lighthouserc.*`) も同形。
- LHCI assertion は warn レベル (非ブロッキング) のままなので、本変更で fail 挙動は変わらない。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint
# diff: .github/workflows/lhci.yml と .claude/tickets/fix-lhci-version-unify.md のみ
git diff --name-only origin/develop
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "fix(ci): LHCI を yarn lhci に統一 (npx 0.14 と devDeps 0.15 不整合解消)"
git push -u origin fix/lhci-version-unify
gh pr create --base develop --head fix/lhci-version-unify \
  --title "fix(ci): LHCI を yarn lhci に統一 (npx 0.14 と devDeps 0.15 不整合解消)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] workflow が `yarn lhci autorun` を呼んでおり、`npx @lhci/cli@*` を含まない
- [ ] `package.json` / `yarn.lock` が変更されていない
- [ ] CI で `yarn install --frozen-lockfile` が成功し、`yarn lhci autorun` が起動する
- [ ] `lighthouserc.*` 設定との互換性 (warn-only assertion は引き続き非ブロッキング)
- [ ] 既存破壊なし (他 workflow / src 無変更)
