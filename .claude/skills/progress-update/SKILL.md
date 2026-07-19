---
name: progress-update
description: merge 済み PR を docs/PROGRESS.md (SSOT) に反映する更新 PR を作る。PR が merge された後、「PROGRESS を更新して」と言われた時、または /wave の完了時に使う。
---

# progress-update — PROGRESS.md 更新 PR

`docs/PROGRESS.md` は改善作業の SSOT。**merge された事実だけ** を反映する (未 merge の PR を「完了」に書かない)。

## 手順

1. **差分把握**: PROGRESS.md に未反映の merged PR を洗い出す
   ```bash
   gh pr list --base develop --state merged --limit 15 --json number,title,mergedAt
   ```
   PROGRESS.md の「完了 PR」表と突き合わせる

2. **更新内容** (該当するもののみ):
   - 「完了 PR」表に行を追加 (番号 / 担当領域 / 説明 1 行)
   - 累計 merged 数の更新 (※ #27 は CLOSED で未 merge — 数え方の注記を壊さない)
   - 「進行中 PR」から merge 済みを除去
   - Phase / Layer の状態更新 (✅ 完了 など)
   - `.claude/tickets/README.md` の Status 更新 (未着手 → merged #N)

3. **PR 化** (docs のみの小 PR):
   ```bash
   bash .claude/scripts/setup-worktree.sh docs/progress-<日付 or 範囲>
   # 編集後:
   git -c commit.gpgsign=false commit -am "docs(progress): #N-#M 反映"
   git push -u origin <branch>
   gh pr create --base develop --title "docs(progress): ..." --body "..."
   gh pr merge <num> --auto --squash --delete-branch
   ```

## 注意

- PROGRESS.md 更新は **必ず別 PR** (機能 PR に混ぜない — 本 repo の慣習)
- 環境固定事項 (Node / auto-merge / CI 必須 check) に変化があった場合はその節も直す
- 説明は 1 行で。詳細は ticket に既にある
