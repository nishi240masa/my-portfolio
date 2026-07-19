---
name: wave
description: 複数 PR を DAG ストリーミングで並列実装する編成 (PM = main loop + worktree 並列実装 + 別エージェントレビュー + LGTM 後 auto-merge)。「まとめて実装して」「並列で進めて」など 3 PR 以上の大規模改善を頼まれた時に使う。1-2 PR なら /impl-pr で足りる。
argument-hint: <ticket ファイル名... (省略時は PROGRESS.md の未着手から選定)>
---

# wave — 複数 PR の DAG ストリーミング編成

## 原則

- **PM = main loop (自分)** が DAG を保持し、依存解放を監視する。実装・レビューはエージェントに委譲
- 波単位の barrier (Wave 1 全完了 → Wave 2) は待ち時間が膨らむ。**完了 PR から順に依存を解放** するストリーミングにする
- 仕様は必ず `.claude/tickets/<slug>.md` に commit してから始める (会話 context に閉じない)

## 手順

1. **DAG 構築**: 対象 ticket の「依存」欄から依存グラフを作る。ticket が無いものは先に `/ticket` で作成
2. **Workflow で編成** (ローカル。Workflow が使えない環境は `.claude/patterns/cloud-serial-workflow/SKILL.md` にフォールバック):
   - `pipeline(independentTickets, impl, review, merge)` — 独立 ticket はフェーズ境界なしで流す (impl 完了した PR から順に review へ)
   - impl agent: `agentType: 'pr-implementer'` (Workflow opts) / Agent ツールなら `subagent_type: pr-implementer`。prompt は ticket パス + branch 名のみでよい (環境制約は `.claude/agents/pr-implementer.md` が持つ)。model は agent 定義 frontmatter で固定 (implementer = opus / critic = sonnet) — 呼び出し側で `model` を上書きしない (main loop の Fable を継承させないため)
   - review agent: `agentType: 'pr-critic'` + persona 指定。**実装 agent とは別エージェント** に必ず分ける (自己レビューは blocker 見落としが実証済み)。pr-critic は Edit/Write を持たないため、コード修正が混ざる事故をツールレベルで抑止できる
   - merge: LGTM + CI green + non-CONFLICTING で `gh pr merge --auto --squash --delete-branch`
   - 依存のある ticket は、依存先の merge を確認してから同じ pipeline に投入
3. **PM の仕事** (エージェントに委譲しない):
   - REQUEST_CHANGES が返った PR → 修正指示を出して re-review へ戻す (最大 2 往復、超えたらユーザーへ)
   - CONFLICTING → PM が worktree で `git merge origin/develop` → 解消 → push
   - token/budget 残量の監視 (`.claude/patterns/budget-guard/SKILL.md`)。残りが少なければ着手済み PR の完遂を優先し、新規投入を止める
4. **完了報告**: merged PR 一覧を出し、`/progress-update` で PROGRESS.md 更新 PR を作る

## 注意

- 同一ファイルを触る ticket 同士は並列に走らせない (DAG 上で直列化する)
- 各エージェントへの指示には必ず ticket パスを含める (Node 20 PATH / worktree 手順は `pr-implementer` の定義側が持つ。pr-critic に build/test を頼む場合や汎用エージェントを使う場合は従来通り Node 20 PATH 等を注入する)
