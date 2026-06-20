# Portfolio Improvement Progress

> このファイルは `develop` における改善作業の **SSOT (Single Source of Truth)**。
> 各 wave の完了時に PR で更新する。新セッション(ローカル/クラウド/別エージェント)はまずこれを読む。

## 設計の出典

- 全体方針と各 PR の仕様: [docs/DESIGN_PROPOSAL.md](./DESIGN_PROPOSAL.md)
- 個別 PR の実装仕様: [.claude/tickets/](../.claude/tickets/)
- 再開手順: [.claude/RESUME.md](../.claude/RESUME.md)

## 環境上の固定事項 (必ず守る)

- **Node**: >= 20 (PATH に `/Users/k23087kk/.nodebrew/current/bin` が必要)
- **Yarn**: 1.22.x
- **auto-merge**: 2026-06-20 に有効化済み。`gh pr merge --auto --squash --delete-branch` で CI green を待って自動マージできる。CI 失敗の場合は merge されない (CF Pages 失敗は required check ではないので無視される)。直接 merge する場合も従来通り `gh pr merge --squash --delete-branch` で可能。
- **Cloudflare Pages CI**: admin が `node:fs` を使う関係で全ルートが `runtime='nodejs'` になっており next-on-pages の Edge 要件と非互換。PR preview は **常に失敗するが merge ブロックしない**ので無視可。根本対処は follow-up
- **Worktree**: `$(git rev-parse --show-toplevel)/../portfolio-wt/<branch-slug>` に統一(local/cloud 両対応のため。`/tmp/` は使わない)
- **node_modules**: 各 worktree で `ln -sfn $(git rev-parse --show-toplevel | xargs dirname | xargs basename)/my-portfolio/node_modules node_modules` で symlink (yarn install は repo ルートで1回だけ)
- **Bash 冒頭**: `export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"` を必ず付ける

## 完了 PR (develop 統合済)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #1 | perf(images) | Perf/SEO | AVIF/WebP + next/image統一 + 不要SVG削除 |
| #2 | a11y | A11y | skip-link + ARIA + コントラスト(--fg-muted) |
| #3 | refactor(layout) | アーキテクト | AdSense撤去 + next/font + Metadata + Cookie テーマ + robots/sitemap |
| #4 | feat(schemas) | アーキテクト | Zod SSOT (src/lib/schemas/) + POST/PUT 分離 |
| #5 | feat(repositories) | アーキテクト | GitHub Contents API driver (REPOSITORY_DRIVER=github で切替) |
| #6 | fix(ci) | アーキテクト | CF Pages CI 真因の明文化 (docs/CLOUDFLARE_PAGES_SETUP.md) |
| #7 | feat(seo) | Perf/SEO | Person JSON-LD + 動的OG画像(next/og) + jsonld helpers |
| #8 | feat(i18n) | A11y/i18n | /en サブセット ランディング + hreflang |
| #9 | perf(isr) | Perf/SEO | force-dynamic 撤廃 + unstable_cache(tags) + Markdown SSR |
| #10 | feat(ux) | UX | Contact常駐 + NextStepCTA + ?tag= URL同期 + RelatedPosts |
| #11 | feat(admin) | アーキテクト | Server Actions + useActionState + CSRF 強化 |
| #12 | feat(content+ci) | コンテンツ/CI | /articles + /journal + GH Actions feeds + Lighthouse CI / axe / Playwright |

## Layer 2 (未着手)

| # | logical PR | 状態 | チケット |
|---|---|---|---|
| PR-9 | Production ケーススタディ化 + DanIndicator a11y 刷新 | 未着手 | [feat-case-study-and-dan-indicator.md](../.claude/tickets/feat-case-study-and-dan-indicator.md) |

## Follow-up Issues (大規模対応のため別 PR で実施)

| 領域 | 内容 |
|---|---|
| Perf | root layout の `cookies()` を Theme Client Provider に局所化し /home /profile /skill /production 一覧の実 SSG 化 (現状は /production/[id] のみ SSG) |
| SEO | OG 画像の alt 動的化 / 落款を漢字一字化 ('west' → '西' 等) |
| CI | `@lhci/cli` バージョン不整合: workflow が `npx @lhci/cli@0.14.x`, devDeps は `^0.15.1` → `yarn lhci autorun` 統一 |
| Cache | per-id revalidate tag 粒度: 現在 `tags: ['productions']` で 1 件更新が全 id 失効。`tags: ['productions', \`production:\${id}\`]` に |
| UX | AdminForm の「✓ 保存しました」が貼り付く: 変更検知 or タイマーで idle 復帰 |
| CF Pages 根本対処 | REPOSITORY_DRIVER=github 切替 + admin を edge runtime 化(大規模、別 epic) |

## 開発フロー (各 PR 共通)

```bash
# 1. 最新 develop から worktree
cd $REPO && git fetch origin develop --prune
git -C $REPO worktree add -B <branch> ../portfolio-wt/<branch> origin/develop
cd ../portfolio-wt/<branch>
ln -sfn $REPO/node_modules node_modules

# 2. 仕様読み込み
cat .claude/tickets/<branch>.md  # 仕様の SSOT

# 3. 実装

# 4. 検証
yarn lint && yarn test --passWithNoTests && yarn build

# 5. コミット & PR
git add -A
git -c commit.gpgsign=false commit -m "..."
git push -u origin <branch>
gh pr create --base develop --head <branch> --title "..." --body "..."

# 6. レビュー (別エージェント or self-critique)
gh pr diff <num>
# ... 専門領域から批判的にレビュー
gh pr review <num> --approve --body "..." または --request-changes --body "..."

# 7. マージ (auto-merge 有効化済 / 2026-06-20)
# 推奨: enqueue して放置 — CI green を待って自動マージされる (polling 不要)
gh pr merge <num> --auto --squash --delete-branch

# 参考: 即時 merge したい / 古い polling パターン
# gh pr checks <num> --json name,bucket -q '.[]|select(.name=="test")|.bucket'
# gh pr view <num> --json mergeable -q '.mergeable'  # MERGEABLE 確認
# gh pr merge <num> --squash --delete-branch

# 8. PROGRESS.md を更新する PR を立てる
```

## 進行原則

1. **Phase ごとに直列、Phase 内は DAG 並列**: Layer 0 → 1 → 2 の順、各 Layer 内は file overlap がない限り並列
2. **別エージェントレビュー**: 実装者と別 persona でレビュー (BLOCKER/MAJOR ≥1 件で REQUEST_CHANGES)
3. **CI green + LGTM + non-CONFLICTING で merge**: 3 条件全部
4. **conflict は PM (会話のメイン loop) が手動解消**: 別 worktree で `git merge origin/develop` → fix → push
5. **CF Pages CI 失敗は無視**: test と Vercel が pass なら可
6. **トークン残量 90% で停止**: 停止サマリ + 再開時の合言葉を残す
