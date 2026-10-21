# chore-deps-security-audit

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/deps-security-audit`
- **base**: `develop`
- **PR title**: `chore(deps): yarn audit の脆弱性を解消 (next-auth beta.32 / resolutions 等)`
- **依存**: なし
- **想定 reviewer 観点**: 既存破壊 (auth / edge / CF build) / major bump の妥当性 / resolutions の過不足

## ゴール

`yarn audit` (2026-10-21 時点: 105 件 = Critical 4 / High 46 / Moderate 42 / Low 13) を
**修正版が存在するものは全て解消**する。修正版が存在しない advisory
(patched_versions が `<0.0.0`) のみ残してよく、PR 本文に一覧で明記する。

## 現状の advisory (root 依存別)

| root | 脆弱 package | 必要 version |
|---|---|---|
| next-auth (**Critical**) | next-auth, @auth/core | next-auth >=5.0.0-beta.32 / @auth/core >=0.41.3 |
| vercel (devDep, Critical) | tar, path-to-regexp, undici, ajv, uuid, @tootallnate/once, esbuild | tar >=7.5.21, path-to-regexp >=6.3.0, undici >=6.28.1 (5.x 系は >=5.29.0) 等 |
| next | postcss | >=8.5.23 |
| wrangler | sharp, esbuild | sharp >=0.35.5, esbuild >=0.25.0 |
| @cloudflare/next-on-pages | ws, @fastify/busboy, undici, cookie, esbuild | ws >=8.21.0, busboy >=3.2.2, cookie >=0.7.0 |
| @lhci/cli | tmp, basic-ftp, uuid | tmp >=0.2.6, basic-ftp >=6.2.1 |
| rehype-katex / remark-math | katex | >=0.18.2 |
| devDep 直接 | esbuild `0.24.2` 固定 | >=0.25.0 |
| 修正版なし (残置可) | extract-zip, braces, sprintf-js | — |

## 方針 (優先順)

1. **直接依存を同一 major 内の最新へ** (`yarn upgrade <pkg>@^x` 等)。
   - `next-auth` → `^5.0.0-beta.32` 以上 (Critical。最優先)
   - `next` / `eslint-config-next` → **15.x の最新** (Next 16 への major bump は **禁止**: 別 ticket)
   - `esbuild` 固定 `0.24.2` → `0.25.x` 以上 (polyfill plugin との互換確認)
   - `@cloudflare/next-on-pages` / `@lhci/cli` → 最新
2. 直接依存の major bump は **devDep の CLI ツールのみ可** (`vercel` 39 → 最新)。
   `wrangler` 3 → 4 は `yarn build:cf` / `yarn preview` 相当が通るなら可、
   壊れるなら 3.x 最新 + resolutions で対応。
3. それでも残る transitive は `package.json` の **`resolutions`** で patched 版へ固定
   (例: postcss, sharp, tar, undici, ws, katex, tmp, basic-ftp, cookie …)。
   - major 跨ぎの resolutions (例: cookie 0.x → 1.x, tar 6 → 7) は親が壊れないか確認し、
     壊れるなら patched の同 major 版を選ぶ。`**/pkg` 形式で必要な範囲に絞ること。
4. 修正後 `yarn audit` を再実行し、残件が「修正版なし」のみであることを確認。

## 変更ファイル (これ以外は触らない)

- `package.json` (dependencies / devDependencies / resolutions)
- `yarn.lock`
- `.claude/tickets/chore-deps-security-audit.md` (本ファイル)
- 依存更新で **型/lint エラーが出た場合に限り** 最小限の src 修正可 (PR 本文に理由を書く)

## 禁止事項

- Next 16 / React major / MUI major などフレームワーク major bump
- npm / pnpm の使用 (`package-lock.json` を作らない)
- 機能変更・リファクタ

## 検証 (全て green 必須)

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn install --frozen-lockfile
yarn audit --summary          # 残件 = 修正版なしのみ
yarn lint && yarn test && yarn build
rm -rf .next && yarn build:cf  # CF Pages (edge) build が通ること
```

PR 本文に audit の before/after 件数と、残置 advisory の一覧 (理由: 修正版なし) を記載する。
