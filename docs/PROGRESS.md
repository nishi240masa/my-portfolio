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
- **Cloudflare Pages CI** (旧: 常に失敗): Phase 2 (PR #28-#34) で全 dynamic route を edge runtime 化し、edge required list が空になったため **CF dashboard で secrets を設定すれば本番で PR preview が通る想定**。実 green 化は CF dashboard 側の設定後に確認。設定手順は [docs/CLOUDFLARE_PAGES_SETUP.md](./CLOUDFLARE_PAGES_SETUP.md)
- **Worktree**: `$(git rev-parse --show-toplevel)/../portfolio-wt/<branch-slug>` に統一 (local/cloud 両対応のため。`/tmp/` は使わない)
- **node_modules**: 各 worktree で `ln -sfn $REPO/node_modules node_modules` の symlink で共有 (yarn install は repo ルートで1回だけ)
- **CI 環境変数**: `.github/workflows/test.yml` の build step に `NEXT_PUBLIC_SITE_URL` が渡る (jsonld の prod 必須)。default は Vercel preview URL、上書きは GitHub Variables の `NEXT_PUBLIC_SITE_URL` で

## 完了 PR (develop 統合済 / 計 32 PR merged ※ #27 は CLOSED で未merge、#33/#35 が両方 merge された時点で 34 PR)

> 番号の歯抜けについて: **#27 は CLOSED (merged されず)**。#28-#32 は #27 で計画していた admin/api edge 化を Phase 2a/2b/2c に再分割したもの。merge 数の累計は merged の実数 (#1-#26, #28-#32, #34 = 32) を SSOT とする。

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

### Layer 2 — 機能完成 (8 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #14 | fix(cache) | Perf | per-id revalidate tag 粒度 (`production:${id}`) |
| #15 | a11y(skill) | A11y | DanIndicator role=meter + 7段凡例 + 無段ラベル + meter accessible name + ハッチパターン |
| #16 | fix(admin) | UX/A11y | AdminForm「✓ 保存しました」3秒 idle 復帰 + role=status aria-live |
| #17 | feat(og) | SEO | OG 画像の alt 動的化 + 落款を漢字一字「西」へ |
| #18 | feat(content) | コンテンツ | Production ケーススタディ化 (caseStudy: 問・工・果 + metrics + Article JSON-LD) + serializeJsonLd XSS escape |
| #19 | perf(ssg) | Perf | root layout cookies() → Client Theme Provider 局所化 (公開ページ実 SSG 化) + CI に NEXT_PUBLIC_SITE_URL |
| #25 | a11y(skill) | A11y | DanIndicator labelledby narrow + years 空時 `'(0/6, )'` 末尾カンマ防御 + dark mode hairline-strong コントラスト (WCAG 1.4.11) |
| #26 | refactor(admin) | UX/DRY | AdminForm 4 Editor の重複 useEffect を `useAutoDismissOnSuccess(state)` カスタムフックへ集約 |

### プロセス基盤 (6 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #13 | chore(process) | プロセス | docs/PROGRESS.md / DESIGN_PROPOSAL.md / .claude/{RESUME, tickets}/ 体系化 |
| #20 | docs | プロセス | auto-merge 有効化を PROGRESS / RESUME / tickets に反映 |
| #21 | chore(patterns) | プロセス | .claude/patterns/ (self-critique / budget-guard / cloud-serial-workflow) — Claude Code skill loader 衝突回避で skills→patterns |
| #22 | chore(scripts) | プロセス | .claude/scripts/preflight.sh + setup-worktree.sh + RESUME 更新 |
| #23 | docs(progress) | プロセス | Layer 2 + プロセス基盤 完了反映 (累計 22 PR merged 時点) |
| #24 | fix(ci) | プロセス/CI | LHCI を `yarn lhci` に統一 (workflow `npx @lhci/cli@0.14.x` と devDeps `^0.15.1` の不整合解消) |

### CF Pages Epic — Phase 1 / 2a / 2b / 2c / 2d-1 (6 PR)

| # | PR | 担当領域 | 説明 |
|---|---|---|---|
| #28 | perf(public) | Perf/CF | 公開ルート (home/profile/skill/production[/id]/articles[/slug]/journal/en/contact) の `runtime='nodejs'` 撤廃 + 静的 import 化 + OG image edge 化 (CF Pages Phase 1) |
| #29 | docs(progress) | プロセス | #24-#28 反映 + Phase 1 完了 + Phase 2 計画 |
| #30 | refactor(repositories) | アーキテクト/CF | json driver を lazy import 化 (Phase 2a)。`src/lib/repositories/{json,github,sync.ts,index.ts}` を driver 別 barrel に分割し、edge bundle に `node:fs` を混入させない |
| #31 | perf(edge) | Perf/CF | `api/auth/[...nextauth]` を edge runtime 化 (Phase 2b)。JWT-only / GitHub driver で edge 互換 |
| #32 | perf(edge) | Perf/CF | admin pages 9 (layout.tsx 含む) + Server Actions 4 + api/admin 5 を edge runtime 化 (Phase 2c)。async factory pattern + next.config.mjs の `node:*` externals 追加 |
| #34 | fix(repositories) | アーキテクト/CF | edge runtime + json driver の partial failure を明示的 throw (Phase 2d-1)。`NEXT_RUNTIME==='edge' && driver==='json'` で fail-fast guard を全 async factory に追加 |

## 進行中 PR

- **#33** Phase 2d-2 (env/docs) — wrangler.toml / .env.example / docs/CLOUDFLARE_PAGES_SETUP.md
- **#35** Phase 2d-3 (本 PR) — PROGRESS.md SSOT 整合 + next.config.mjs コメント + force-dynamic 撤廃

## CF Pages Epic (進行中)

### Phase 1 — 公開ルート edge/static 化 ✅ 完了

| # | 状態 | 内容 |
|---|---|---|
| #28 | ✅ merged (2026-06-20) | 公開ページの `runtime='nodejs'` 撤廃。静的化可能なルート (home/profile/skill/production/[id]/en) は CF Pages 静的アセットとして配信。articles/journal は force-static 化。OG image は edge 化済。 |

### Phase 2 — admin/api/auth edge 化 (2a / 2b / 2c ✅ 完了 / 2d 進行中)

Phase 1 完了時点で `yarn build:cf` が依然 fail していたルートは **計 15** (admin pages 9 + api/admin 5 + api/auth 1):
- **admin pages**: 9 (`src/app/admin/layout.tsx` + `/admin`, `/admin/home`, `/admin/skill`, `/admin/profile`, `/admin/productions`, `/admin/productions/new`, `/admin/productions/[id]`, `/admin/login`)
- **api/admin**: 5 (`home`, `productions`, `profile`, `skills`, `productions/[id]`)
- **api/auth**: 1 (`[...nextauth]`)

| Phase | branch | 状態 | 内容 |
|---|---|---|---|
| 2a | `refactor/repositories-barrel-lazy` | ✅ merged (#30, 2026-06-21) | `src/lib/repositories/index.ts` を driver 別 barrel に分割し json driver を lazy import 化。`json` 側 module の `node:fs` 依存を edge bundle から逃がす。Phase 2b/2c の前提。 |
| 2b | `perf/cf-edge-auth` | ✅ merged (#31, 2026-06-21) | `api/auth/[...nextauth]` を `runtime='edge'` 化。NextAuth は JWT only / GitHub driver 強制で edge 互換確認済。 |
| 2c | `perf/cf-edge-admin-pages` | ✅ merged (#32, 2026-06-21) | `src/app/admin/**` の 9 ファイル (`layout.tsx` 含む 8 page + layout) + Server Actions 4 + `api/admin/*` 5 を edge 化。next.config.mjs に edge layer 用の `node:fs` / `node:path` externals fallback を追加。 |
| 2d | `chore/cf-pages-docs-and-env` ほか | 進行中 (defensive guard / env / docs) | CF Pages 本番で `REPOSITORY_DRIVER=github` を強制 (json driver は edge で動かないため)。`docs/CLOUDFLARE_PAGES_SETUP.md` に Phase 2 完了状態と env 設定を反映。本 PR (Phase 2d-3) は PROGRESS 反映 + 軽微 follow-up を兼ねる。 |

## 既知の問題 (Known Issues)

- **Vercel preview deploy が systematically 失敗** (PR #28 / 2026-06-20 以降):
  - コード自体は `yarn build` ローカル green、Vercel deploy のみ fail。
  - 詳細ログ取得には `npx vercel inspect dpl_<id> --logs` が必要 (オーナー作業)。
  - 仮説候補:
    - `NEXT_PUBLIC_SITE_URL` 等の env が Vercel 側に未設定
    - opengraph-image edge runtime と Vercel build target の互換性
    - barrel 物理分割 (Phase 2a) 後のモジュール解決
  - `test` job (GitHub Actions) と `build:cf` は green なので **merge は問題なし**。

## Follow-up Issues (大規模対応 / 別 PR で実施)

| 優先度 | 領域 | 内容 |
|---|---|---|
| 中 | a11y/SEO | OG image の alt をさらに改善 (現状は title 含むが、Twitter Card 等への動的化余地) |
| 低 | コンテンツ | caseStudy の minor: MetricsEditor/LinksEditor の key={i} → 安定 id、article.role と caseStudy.role の二重持ち hint、image なし時 Article→CreativeWork フォールバック、Tategaki モバイル grid 調整 |
| 低 | SEO | Article rich result の image 必須に対する Editor hint |

### 完了済 (履歴)

- LHCI バージョン不整合 → **#24** で `yarn lhci` 統一により解決
- DanIndicator labelledby スコープ広すぎ / years 空時 `'(0/6, )'` 末尾カンマ → **#25** で解決
- AdminForm 4 Editor の useEffect 重複 → **#26** で `useAutoDismissOnSuccess` 化
- dark mode hairline-strong / ハッチパターン WCAG 1.4.11 → **#25** で解決

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
