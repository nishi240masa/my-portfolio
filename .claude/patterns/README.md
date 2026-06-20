# .claude/patterns/

**本リポジトリ固有のパターン集** です。プロンプト例は本プロジェクトの慣習 (yarn / develop ベース / 日本語コミット / nodebrew 経由の Node 20) に最適化されています。

> 他プロジェクトに転用する場合は次の値を読み替えてください:
> - `REPO_ROOT` (例: `/Users/k23087kk/src/my-portfolio`)
> - `PKG_MGR` (本 repo は `yarn`、別 repo では `npm` / `pnpm` など)
> - `BASE_BRANCH` (本 repo は `develop`、別 repo では `main` など)
> - コミットメッセージ言語 (本 repo は日本語)
> - Node 起動方法 (本 repo は nodebrew + `export PATH=".../current/bin:$PATH"`)

> 注: これらは Claude Code の **組み込み skill ではありません**。
> ディレクトリ名を `skills/` から `patterns/` に変更したのは、Claude Code の skill loader がこのディレクトリを誤って組み込み skill として認識する衝突を回避するためです。
> プロジェクトに参加した任意のエージェント (ローカル / クラウド / 別チャット) が
> 「この repo ではこういう進め方をする」というルールを参照するためのドキュメント置き場です。

組み込みの slash skill (`/init`, `/review`, etc.) は別 (`~/.claude/skills/` や Claude Code 配布物) にあります。

## ファイル

| pattern | 目的 |
| --- | --- |
| [self-critique/SKILL.md](./self-critique/SKILL.md) | 単一エージェントでも品質を担保する impl → critique → fix ループ |
| [budget-guard/SKILL.md](./budget-guard/SKILL.md) | Workflow 内で token budget を見て phase をスキップ / ループ停止する (概念モデル) |
| [cloud-serial-workflow/SKILL.md](./cloud-serial-workflow/SKILL.md) | クラウド CCR (Workflow 不可) で Agent を手動シリアル編成する代替パターン |

## 想定読者

- 本 repo で PR を上げる Claude Code エージェント (ローカル / クラウド)
- Workflow script を書く orchestrator
- 別セッションから参加した実装エージェント

## いつ参照するか

- `.claude/RESUME.md` を読んだ後、自分の環境 (Workflow 使える / 使えない) に応じて該当 pattern を読む
- ticket の `reviewerFocus` で persona 切替が必要な時 → `self-critique`
- 長時間 / 複数 PR セッション → `budget-guard`
- クラウド側で動いている → `cloud-serial-workflow`

## 関連 SSOT

- `.claude/RESUME.md`: セッション再開手順
- `.claude/tickets/<branch>.md`: PR 単位の仕様
- `docs/PROGRESS.md`: 完了 PR と次の作業
- `docs/DESIGN_PROPOSAL.md`: 全体方針
