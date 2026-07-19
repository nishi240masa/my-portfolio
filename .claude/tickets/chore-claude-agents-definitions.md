# chore/claude-agents-definitions

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/claude-agents-definitions`
- **base**: `develop`
- **PR title**: `chore(claude): pr-implementer / pr-critic サブエージェント定義を追加し wave から参照`
- **依存**: なし
- **想定 reviewer 観点**: アーキテクト

## ゴール

/wave が実装・レビューの各エージェントへ毎回プロンプトで注入している役割定義 (Node 20 PATH / worktree 手順 / persona レビュー手順) を `.claude/agents/` のカスタムサブエージェント定義に切り出す。特にレビュアー (`pr-critic`) は **Edit/Write を持たないツール制限** で「実装者と別人格・コードを直せない」ことを構造的に保証する。

(スコープ拡張 2026-07-19) 加えて **オーケストレーション原則** を CLAUDE.md に明文化する: main loop (特に Fable) は指示役 (PM) に徹して実装をサブエージェントへ委譲し、独立作業は並列で走らせて時間短縮と品質担保 (別エージェントレビュー) を両立する。/wave (3 PR 以上) に限らず常時適用の原則とする。

## 変更ファイル (これ以外は触らない)

- `.claude/agents/pr-implementer.md` (新規) — 実装エージェント定義。全ツール可。手順 SSOT は `.claude/skills/impl-pr/SKILL.md` を参照させ、環境制約 (Node 20 PATH / worktree / edge 互換 / ticket 外変更禁止) のみ本文に持つ
- `.claude/agents/pr-critic.md` (新規) — レビューエージェント定義。tools は Read / Grep / Glob / Bash のみ (Edit/Write なし)。手順 SSOT は `.claude/skills/review-pr/SKILL.md` を参照。persona は呼び出しプロンプトまたは ticket の「想定 reviewer 観点」から
- `.claude/skills/wave/SKILL.md` — 手順 2 の impl agent / review agent を「`/impl-pr`・`/review-pr` の手順を注入」から「`agentType: 'pr-implementer'` / `'pr-critic'` (Workflow opts) ないし Agent ツールの subagent_type 指定」に書き換え。「各エージェントへの指示には Node 20 PATH を含める」の注意書きは agent 定義側に移った旨へ更新
- `.claude/skills/impl-pr/SKILL.md` — 前提に追記: main loop がオーケストレータの場合は inline 実行せず `pr-implementer` へ委譲 (手順 SSOT はこのファイルのまま)
- `CLAUDE.md` — Skills セクション直後に `.claude/agents/` の説明と「オーケストレーション原則」セクションを追加 (main loop = 指示役 / 実装は委譲 / 独立作業は並列 / 別エージェントレビュー必須)
- `.claude/tickets/chore-claude-agents-definitions.md` (新規) — 本 ticket
- `.claude/tickets/README.md` — 既存チケット表に行追加

## 禁止事項

- `.claude/skills/review-pr/SKILL.md` — persona 定義の SSOT はここのまま。agent 定義への転記 (二重管理) をしない
- `.claude/patterns/self-critique/SKILL.md` — 候補 3 (self-critique-reviewer agent) は今回 scope 外。pattern は現状維持
- persona ごとの agent 分割 (a11y-reviewer 等) — SKILL.md との二重管理になるためしない
- `src/` 以下 — コード変更なし

## 実装ポイント

- agent 定義の frontmatter: `name` / `description` / `tools` (pr-critic のみ。カンマ区切りで `Read, Grep, Glob, Bash`。pr-implementer は tools 省略 = 全ツール継承)。`model` は指定しない (session 継承)
- description は Agent ツールの自動委譲判断に使われるため「いつ使うか」を含める (既存 skill の description の書き方に合わせる)
- 本文は薄いラッパに徹する: 対応する SKILL.md への参照 + そこに書けない環境制約のみ。手順の転記はしない
- pr-critic の本文には「blocker/major ≥1 → REQUEST_CHANGES / なければ approve + auto-merge enqueue」の判定と、自分ではコードを修正できない (修正指示を返す) ことを明記
- wave の書き換えは最小差分: 手順 2 の 2 bullet と「注意」の 1 bullet のみ

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build
```

(md のみの変更だが定型検証は流す。加えて frontmatter が既存 skill と同形式か目視確認)

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "chore(claude): pr-implementer / pr-critic サブエージェント定義を追加し wave から参照"
git push -u origin chore/claude-agents-definitions
gh pr create --base develop --head chore/claude-agents-definitions --title "..." --body "..."
```

PR body 雛形:
```markdown
## Summary
- .claude/agents/ に pr-implementer / pr-critic を新設 (pr-critic は Edit/Write なしのツール制限)
- /wave のエージェント起動を subagent_type 参照に書き換え、手順 SSOT は skills 側を維持

## Test plan
- [ ] yarn lint / yarn test / yarn build
- [ ] CI green (test, Vercel)
- [ ] frontmatter 形式が既存 skill と整合

🤖 Generated with Claude Code
```

## レビュー観点 (チェックリスト)

- [ ] 仕様通りに実装されているか (agent 2 定義 + wave/impl-pr/CLAUDE.md の参照書き換え)
- [ ] 禁止事項に違反していないか (review-pr の persona 定義を転記していないか)
- [ ] SSOT の重複がないか (agent 本文が SKILL.md の手順を丸写ししていないか)
- [ ] pr-critic の tools 制限に Edit/Write が混入していないか
- [ ] 既存破壊 (既存 skill の frontmatter / 参照経路を壊していないか)
