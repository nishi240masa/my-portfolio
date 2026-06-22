# chore/progress-and-cleanups

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/progress-and-cleanups`
- **base**: `develop`
- **PR title**: `chore: PROGRESS.md Phase 2a-c 反映 + 軽微 follow-up (Phase 2d-3)`
- **依存**: PR #29/#30/#31/#32 が develop に merge 済
- **想定 reviewer 観点**: プロセス (PROGRESS.md SSOT) + 軽微整合のみ

## ゴール

Phase 2a/2b/2c (PR #30/#31/#32) merge を docs/PROGRESS.md に反映し、
reviewer が拾った pre-existing minor finding と表記揺れを併せて整える。
累計 27 → 32 PR merged。CF Pages Epic は Phase 2d (defensive guard / env / docs)
が進行中であることを明示する。

本 PR 自身は Phase 2d 系列の docs/cleanup PR (Phase 2d-3) として位置付ける
(Phase 2d-1: defensive guard, Phase 2d-2: env / docs は後続別 PR)。

## 変更ファイル (これ以外は触らない)

1. `docs/PROGRESS.md`
   - 「完了 PR」累計 27 → 32 に更新
   - CF Pages Epic セクションを Phase 1 (1 PR) → Phase 1 / 2a / 2b / 2c (5 PR) に拡張、
     #29/#30/#31/#32 を追加
   - Phase 2 サブテーブルの 2a/2b/2c を `✅ merged` に更新、2d を「進行中
     (defensive guard / env / docs)」に
   - 進行中 PR セクションを「なし」→「Phase 2d」に書き換え

2. `src/app/admin/productions/new/page.tsx`
   - `export const dynamic = 'force-dynamic'` を削除。repository を使用しないため不要
   - `runtime = 'edge'` (Phase 2c で追加済) は維持

3. `next.config.mjs`
   - webpack edge externals の inline コメント「commonjs 形式の外部参照」を、
     edge target 上での意図 (workers では解決できないため runtime error 経路) を
     より正確に説明する文言に修正。**機能変更なし**、コメントのみ。

4. `.claude/tickets/perf-cf-edge-admin-pages.md`
   - 既存 ticket の「admin 8 + api/admin 5 = 13 ルート」表記と PR body の
     「admin pages (9)」の差分を整合。`layout.tsx` を 1 とカウントし、
     `admin 9 + api/admin 5 = 14 ルート` に統一。

5. `.claude/tickets/chore-progress-and-cleanups.md` (本ファイル, 新規)

## 禁止事項

- `src/lib/repositories/**` の変更 (Phase 2d-1 の領域)
- `.env*` / `wrangler.toml` / `docs/CLOUDFLARE_PAGES_SETUP.md` の変更 (Phase 2d-2 の領域)
- `yarn.lock` 変更 (ライブラリ追加なし)

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "chore: PROGRESS.md Phase 2a-c 反映 + new page force-dynamic 撤廃 + 軽微整合"
git push -u origin chore/progress-and-cleanups
gh pr create --base develop --head chore/progress-and-cleanups \
  --title "chore: PROGRESS.md Phase 2a-c 反映 + 軽微 follow-up (Phase 2d-3)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] PROGRESS.md の累計が 32 に更新されている
- [ ] #29/#30/#31/#32 が完了 PR 一覧に追加
- [ ] Phase 2a/2b/2c が `✅ merged` 表記
- [ ] Phase 2d が「進行中」として明示
- [ ] `src/app/admin/productions/new/page.tsx` から `dynamic` export が消えている
- [ ] `runtime = 'edge'` は残っている
- [ ] next.config.mjs の機能変更が **ない** (コメントのみ)
- [ ] perf-cf-edge-admin-pages.md のルート数が `admin 9 + api/admin 5 = 14` で一貫
- [ ] yarn lint / yarn test / yarn build 全て pass
