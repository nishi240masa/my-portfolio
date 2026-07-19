# CLAUDE.md

Next.js 15 (App Router) 製ポートフォリオサイト。Vercel (本番) + Cloudflare Pages (edge 検証) にデプロイ。

## 環境 (最初に必ず)

- **Node >= 20 必須**。デフォルト shell は Node 18 なので、build/dev/test の前に必ず:
  ```bash
  export PATH="$HOME/.nodebrew/current/bin:$PATH"   # node -v → v20.x を確認
  ```
- パッケージマネージャは **yarn 1.22** (npm / pnpm 禁止。`package-lock.json` は gitignore 済)
- **`next dev` 起動中に `next build` を走らせない** (同じ `.next` を壊し dev が 500 になる)。dev を止めるか `rm -rf .next`

## コマンド

```bash
yarn dev          # 開発サーバ
yarn lint         # eslint (src のみ)
yarn test         # jest (--passWithNoTests 可)
yarn build        # next build
yarn build:cf     # Cloudflare Pages 向け (next-on-pages)
```

## Git / PR フロー

- ベースブランチは **develop**。PR は `gh pr create --base develop`
- コミットは **日本語 conventional commit** (`feat(seo): ...` 等)。`git -c commit.gpgsign=false commit` で署名スキップ
- **auto-merge 有効**: `gh pr merge <num> --auto --squash --delete-branch` で CI green 待ちの自動マージ
- required check は実質 `test` のみ。**CF Pages / e2e / lhci の失敗は merge を阻まない**
- 並列作業は worktree: `bash .claude/scripts/setup-worktree.sh <branch>` (`$REPO/../portfolio-wt/<slug>` に作成、node_modules は symlink 共有)
- 1 PR = 1 ticket (`.claude/tickets/<branch-slug>.md`)。仕様は会話 context でなく ticket に書く

## SSOT (作業前に読む)

| ファイル | 内容 |
|---|---|
| `docs/PROGRESS.md` | 改善作業の進捗 SSOT。完了 PR / 進行中 / 次の作業 |
| `docs/DESIGN_PROPOSAL.md` | 全体方針と各 PR の仕様 |
| `.claude/tickets/` | 各 PR の実装仕様 (1 ファイル 1 PR) |
| `.claude/RESUME.md` | セッション再開手順 |
| `.claude/patterns/` | 概念パターン集 (self-critique / budget-guard / cloud-serial-workflow) |

## Skills (定型フローの自動化)

- `/resume-work` — セッション開始時の状況把握 (preflight + SSOT + 次の一手。組み込み /resume と別物)
- `/ticket` — ticket 作成の定型化
- `/impl-pr` — ticket 1 枚を worktree → 実装 → self-critique → PR → auto-merge まで
- `/review-pr` — persona ベースの批判的 PR レビュー
- `/wave` — 複数 PR の DAG ストリーミング編成 (PM + 並列実装 + 別エージェントレビュー)
- `/progress-update` — merge 後の docs/PROGRESS.md 更新 PR

## Agents (`.claude/agents/` — /wave・/impl-pr の委譲先)

- `pr-implementer` — ticket 1 枚を worktree で実装し PR を作る (全ツール, **model: opus**)
- `pr-critic` — persona ベース批判的レビュー。**Edit/Write なし** (レビュアーによるコード修正をツールレベルで抑止)。手順 SSOT は各 SKILL.md 側 (**model: sonnet**)
- サブエージェントの model は **agent 定義 frontmatter が SSOT** (実装 = opus / レビュー = sonnet)。main loop の model (Fable 等) を継承させない。Agent / Workflow 呼び出し側での `model` 上書きは原則不要

## オーケストレーション原則 (main loop = 指示役)

- main loop (特に Fable) は **PM/指示役に徹する**: 実装は `pr-implementer`、レビューは `pr-critic` に委譲し、main loop 自身は ticket 準備 / 依存 DAG 管理 / REQUEST_CHANGES の差し戻し / conflict 解消 / merge 管理を担う (詳細は `/wave` 手順 3)。main loop が直接コードを書くのは数行の trivial fix のみ
- **並列化できるものは並列に**: 依存がなく同一ファイルを触らない ticket は worktree 分離で同時に走らせる (3 PR 以上は `/wave`、1-2 PR でも実装は委譲)。観点が複数ある PR は `pr-critic` を persona ごとに並列起動してよい
- **品質担保**: どの経路でも「実装エージェントとは別のエージェントによるレビュー」を必ず挟む (自己レビューは blocker 見落としが実証済み)

## アーキテクチャ要点

- データ層は **driver パターン**: `src/lib/repositories/` (`REPOSITORY_DRIVER=json|github`)。edge runtime では json driver 不可 (fail-fast guard あり)
- バリデーションは **Zod SSOT**: `src/lib/schemas/`
- 全 dynamic route は edge runtime 化済 (CF Pages Epic Phase 2)。新規 route を足す時は edge 互換 (node:fs 等を静的 import しない) を維持する
- 認証は next-auth v5 (JWT-only)。admin 系は Server Actions + CSRF
