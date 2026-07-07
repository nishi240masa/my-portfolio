# chore-claude-skills-and-structure

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/claude-skills-and-structure`
- **base**: `develop`
- **PR title**: `chore(process): CLAUDE.md + .claude/skills 整備 + root docs 整理`
- **依存**: なし
- **想定 reviewer 観点**: プロセス / ドキュメント整合性

## ゴール

繰り返し発生している開発フロー (resume / ticket 作成 / 実装→PR / レビュー / DAG 並列 / PROGRESS 更新) を Claude Code の invocable skill として `.claude/skills/` に整備し、毎セッション再発見していた環境知識を `CLAUDE.md` に常時ロード化する。あわせて root に残っていた 2026-02 時点の陳腐化ドキュメントを `docs/archive/` に移動し、重複ファイルを削除する。

## 変更ファイル (これ以外は触らない)

- `CLAUDE.md` (新規) — 環境 (Node 20 PATH / yarn) / git フロー / SSOT ポインタ / skill 一覧
- `.claude/skills/resume/SKILL.md` (新規) — セッション開始時の状況把握
- `.claude/skills/ticket/SKILL.md` (新規) — ticket 作成の定型化
- `.claude/skills/impl-pr/SKILL.md` (新規) — ticket → worktree → 実装 → self-critique → PR → auto-merge
- `.claude/skills/review-pr/SKILL.md` (新規) — persona ベースの批判的レビュー
- `.claude/skills/wave/SKILL.md` (新規) — 複数 PR の DAG ストリーミング編成
- `.claude/skills/progress-update/SKILL.md` (新規) — merge 後の PROGRESS.md 更新 PR
- `.claude/RESUME.md` — skills への導線追記
- `.claude/patterns/README.md` — skills との役割分担を明記
- `.claude/tickets/README.md` — 既存チケット表に本 ticket を追加
- `docs/archive/README.md` (新規) — アーカイブの説明
- `API_INTEGRATION_GUIDE.md` → `docs/archive/` (git mv)
- `PROJECT_REPORT.md` → `docs/archive/` (git mv)
- `TASK_LIST.md` → `docs/archive/` (git mv)
- `icon.svg` (削除) — `src/app/icon.svg` と byte 単位で同一の重複

## 禁止事項

- `src/` 以下 — コード変更は scope 外
- `docs/PROGRESS.md` — merge 後に `/progress-update` skill で別 PR にて更新 (本 repo の慣習)
- `.claude/patterns/*/SKILL.md` — 概念パターン集としてそのまま残す (skill 化するのはフロー系のみ)

## 実装ポイント

- skill frontmatter は `name` / `description` / (必要なら) `argument-hint` のみ。description に「いつ使うか」を書き、モデルの自動発火とユーザーの `/名前` 呼び出し両方に対応させる
- 過去に `skills/` → `patterns/` へ改名した経緯 (PR #21: frontmatter の無い概念ドキュメントを skill loader が誤認識) があるため、今回の `.claude/skills/` は **正しい frontmatter を持つ本物の skill のみ** を置く
- 各 skill 内のコマンドは既存 SSOT (`RESUME.md` / `preflight.sh` / `setup-worktree.sh`) を呼び出す薄いラッパにし、知識の二重管理を避ける

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
# docs のみの変更なので build は CI に委ねる
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "chore(process): CLAUDE.md + .claude/skills 整備 + root docs 整理"
git push -u origin chore/claude-skills-and-structure
gh pr create --base develop --head chore/claude-skills-and-structure --title "..." --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] skill frontmatter が正しい (name / description)
- [ ] 既存 SSOT (RESUME / patterns / scripts) と矛盾する記述がない
- [ ] 移動したドキュメントへの参照切れがない
- [ ] icon.svg 削除が `src/app/icon.svg` に影響しない
