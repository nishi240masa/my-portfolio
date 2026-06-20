# Portfolio Improvement Progress

> このファイルは `develop` における改善作業の **SSOT (Single Source of Truth)**。
> 各 wave の完了時に PR で更新する。新セッション(ローカル/クラウド/別エージェント)はまずこれを読む。

## 設計の出典

- 全体方針と各 PR の仕様: [docs/DESIGN_PROPOSAL.md](./DESIGN_PROPOSAL.md)
- 個別 PR の実装仕様: [.claude/tickets/](../.claude/tickets/)
- 再開手順: [.claude/RESUME.md](../.claude/RESUME.md)
- 再利用パターン: [.claude/patterns/](../.claude/patterns/) (self-critique, budget-guard, cloud-serial-workflow)
- 起動時セットアップ: `bash .claude/scripts/preflight.sh` (READ-ONLY 状況確認) + `bash .claude/scripts/setup-worktree.sh <branch>` (worktree 作成)

## 環境上の固定事項 (必ず守る)

- **Node**: >= 20 (環境変数で PATH に Node 20 を入れる。例: `export PATH=~/.nodebrew/current/bin:$PATH`)
- **Yarn**: 1.22.x
- **auto-merge**: **有効化済** (2026-06-20)。`gh pr merge <num> --auto --squash --delete-branch` で CI green を待って自動マージ。直接 merge も可能 (`--auto` を外す)
- **CI 必須 check**: `test` のみ実質的に required。`e2e` / `lhci` / `Cloudflare Pages` の失敗は merge を阻まない
- **Cloudflare Pages CI**: admin が `node:fs` を使う関係で全ルートが `runtime='nodejs'` になり next-on-pages の Edge 要件と非互換。PR preview は **常に失敗するが merge ブロックしない**ので無視可。根本対処は follow-up
- **Worktree**: `$(git rev-parse --show-toplevel)/../portfolio-wt/<branch-slug>` に統一 (local/cloud 両対応のため。`/tmp/` は使わない)
- **node_modules**: 各 worktree で `ln -sfn $REPO/node_modules node_modules` の symlink で共有 (yarn install は repo ルートで1回だけ)
- **CI 環境変数**: `.github/workflows/test.yml` の build step に `NEXT_PUBLIC_SITE_URL` が渡る (jsonld の prod 必須)。default は Vercel preview URL、上書きは GitHub Variables の `NEXT_PUBLIC_SITE_URL` で

## 完了 PR (develop 統合済 / 計 22 PR)

### Layer 0 — 基盤 (7 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #1 | perf(images) | Perf/SEO | AVIF/WebP + next/image統一 + 不要SVG削除 |
| #2 | a11y | A11y | skip-link + ARIA + コントラスト(--fg-muted) |
| #3 | refactor(layout) | アーキテクト | AdSense撤去 + next/font + Metadata + Cookie テーマ + robots/sitemap |
| #4 | feat(schemas) | アーキテクト | Zod SSOT (src/lib/schemas/) + POST/PUT 分離 |
| #5 | feat(repositories) | アーキテクト | GitHub Contents API driver (REPOSITORY_DRIVER=github で切替) |
| #6 | fix(ci) | アーキテクト | CF Pages CI 真因の明文化 (docs/CLOUDFLARE_PAGES_SETUP.md) |
| #7 | feat(seo) | Perf/SEO | Person JSON-LD + 動的OG画像(next/og) + jsonld helpers |

### Layer 1 — 機能拡張 (5 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #8 | feat(i18n) | A11y/i18n | /en サブセット ランディング + hreflang |
| #9 | perf(isr) | Perf/SEO | force-dynamic 撤廃 + unstable_cache(tags) + Markdown SSR |
| #10 | feat(ux) | UX | Contact常駐 + NextStepCTA + ?tag= URL同期 + RelatedPosts |
| #11 | feat(admin) | アーキテクト | Server Actions + useActionState + CSRF 強化 |
| #12 | feat(content+ci) | コンテンツ/CI | /articles + /journal + GH Actions feeds + Lighthouse CI / axe / Playwright |

### Layer 2 — 機能完成 (5 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #14 | fix(cache) | Perf | per-id revalidate tag 粒度 (`production:${id}`) |
| #15 | a11y(skill) | A11y | DanIndicator role=meter + 7段凡例 + 無段ラベル + meter accessible name + ハッチパターン |
| #16 | fix(admin) | UX/A11y | AdminForm「✓ 保存しました」3秒 idle 復帰 + role=status aria-live |
| #17 | feat(og) | SEO | OG 画像の alt 動的化 + 落款を漢字一字「西」へ |
| #18 | feat(content) | コンテンツ | Production ケーススタディ化 (caseStudy: 問・工・果 + metrics + Article JSON-LD) + serializeJsonLd XSS escape |
| #19 | perf(ssg) | Perf | root layout cookies() → Client Theme Provider 局所化 (公開ページ実 SSG 化) + CI に NEXT_PUBLIC_SITE_URL |

### プロセス基盤 (5 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #13 | chore(process) | プロセス | docs/PROGRESS.md / DESIGN_PROPOSAL.md / .claude/{RESUME, tickets}/ 体系化 |
| #20 | docs | プロセス | auto-merge 有効化を PROGRESS / RESUME / tickets に反映 |
| #21 | chore(patterns) | プロセス | .claude/patterns/ (self-critique / budget-guard / cloud-serial-workflow) — Claude Code skill loader 衝突回避で skills→patterns |
| #22 | chore(scripts) | プロセス | .claude/scripts/preflight.sh + setup-worktree.sh + RESUME 更新 |

## 進行中 PR

なし (Open: 0 / 全 merge 済)

## Follow-up Issues (大規模対応 / 別 PR で実施)

| 優先度 | 領域 | 内容 |
|---|---|---|
| 高 | CF Pages 根本対処 | REPOSITORY_DRIVER=github 切替 + admin を edge runtime 化(node:fs 排除)。CF PR preview を本当に green にしたい時に着手。大規模 epic |
| 中 | LHCI | `@lhci/cli` バージョン不整合: workflow が `npx @lhci/cli@0.14.x`, devDeps は `^0.15.1` → `yarn lhci autorun` で統一 |
| 中 | a11y/SEO | OG image の alt をさらに改善 (現状は title 含むが、Twitter Card 等への動的化余地) |
| 中 | a11y | DanIndicator の labelledby スコープ広すぎ問題 (skill name span のみに narrow) / years 空時の `'(0/6, )'` 末尾カンマ防御 |
| 中 | UX | AdminForm の 4 Editor で同一の useEffect が重複 → `useAutoDismissOnSuccess(state)` カスタムフック化 |
| 低 | コンテンツ | caseStudy の minor: MetricsEditor/LinksEditor の key={i} → 安定 id、article.role と caseStudy.role の二重持ち hint、image なし時 Article→CreativeWork フォールバック、Tategaki モバイル grid 調整 |
| 低 | A11y/CSS | dark mode の --hairline-strong/ハッチパターンのコントラスト微調整 (WCAG 1.4.11 確認) |
| 低 | SEO | Article rich result の image 必須に対する Editor hint |

## 開発フロー (各 PR 共通)

```bash
# 0. (推奨) 状態把握
bash .claude/scripts/preflight.sh

# 1. 最新 develop から worktree (引数1つで完結)
bash .claude/scripts/setup-worktree.sh feat/<your-branch>

# 2. 仕様読み込み (.claude/tickets/<slug>.md が SSOT)
cat .claude/tickets/<slug>.md

# 3. 実装 (cd は preflight が出力する path に従う)

# 4. 検証
export PATH="$HOME/.nodebrew/current/bin:$PATH"  # Node 20 を PATH に
yarn lint && yarn test --passWithNoTests && yarn build

# 5. コミット & PR
git add -A
git -c commit.gpgsign=false commit -m "..."
git push -u origin <branch>
gh pr create --base develop --head <branch> --title "..." --body "..."

# 6. レビュー (別エージェント or .claude/patterns/self-critique/SKILL.md に従う)
gh pr diff <num>
gh pr review <num> --approve --body "..."   # or --request-changes --body "..."

# 7. マージ — auto-merge 有効化済なので enqueue 推奨
gh pr merge <num> --auto --squash --delete-branch

# 8. PROGRESS.md を更新する小 PR を立てる
```

## 進行原則

1. **Phase ごとに直列、Phase 内は DAG 並列**: Layer 0 → 1 → 2 の順、各 Layer 内は file overlap がない限り並列
2. **別エージェントレビュー** (BLOCKER/MAJOR ≥1 件で REQUEST_CHANGES)。単一エージェント環境では [.claude/patterns/self-critique/SKILL.md](../.claude/patterns/self-critique/SKILL.md)
3. **CI green + LGTM + non-CONFLICTING で merge** (3 条件)
4. **conflict は PM (会話のメイン loop) が手動解消**: 別 worktree で `git merge origin/develop` → fix → push
5. **CF Pages CI 失敗は無視**: `test` と Vercel が pass なら可
6. **トークン残量 90% で停止**: 停止サマリ + 再開時の合言葉を残す
7. **node_modules を絶対に commit しない**: `git add -A` の前に `git status --short` で確認、`my-portfolio/node_modules/` のような stray path が出ていたら掃除してから add
