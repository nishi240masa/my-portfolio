---
name: resume
description: セッション開始時・作業再開時の状況把握。preflight 実行 + SSOT (PROGRESS/tickets/open PR) 確認 + 次の一手の提案。「現状確認」「どこから再開」「続きをやって」と言われた時、または新セッションで作業に入る前に使う。
---

# resume — セッション再開

## 手順

1. **preflight (READ-ONLY)** を実行して環境と repo 状態を一括把握:
   ```bash
   bash .claude/scripts/preflight.sh
   ```
   (Node/gh 認証、現在ブランチ、origin/develop との差分、open PR、branch protection が出る)

2. **SSOT を読む**:
   - `docs/PROGRESS.md` の「進行中 PR」「次の作業」セクション
   - open PR があれば対応する `.claude/tickets/<branch-slug>.md`

3. **open PR の状態確認**:
   ```bash
   gh pr list --base develop --json number,title,state,mergeable,mergeStateStatus,statusCheckRollup
   ```
   - CONFLICTING → merge develop で解消が最優先
   - CI 待ち → auto-merge enqueue 済みか確認
   - CF Pages / e2e / lhci の失敗は required でないため無視可

4. **報告**: 以下を簡潔にまとめてユーザーに提示する
   - 現在のブランチと dirty 状態
   - open PR とそれぞれの状態 / 必要なアクション
   - PROGRESS.md 上の未着手 ticket
   - 推奨する次の一手 (1 つに絞る)

## 注意

- このスキルは **読み取り専用**。branch 作成・commit・merge はしない (それは `/impl-pr` の仕事)
- Node が 18 系でも preflight は動くが、以降の作業に備えて `export PATH="$HOME/.nodebrew/current/bin:$PATH"` を通しておく
