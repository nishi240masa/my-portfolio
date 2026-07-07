---
name: impl-pr
description: ticket 1 枚を実装して PR にする一気通貫フロー (worktree 作成 → 実装 → self-critique → lint/test/build → commit → push → PR 作成 → auto-merge enqueue)。「この ticket を実装して」「PR にして」と言われた時に使う。
argument-hint: <ticket ファイル名 or ブランチ名>
---

# impl-pr — ticket → PR 一気通貫

## 前提

- ticket (`.claude/tickets/<slug>.md`) が存在すること。無ければ先に `/ticket` で作る
- Node 20 PATH: `export PATH="$HOME/.nodebrew/current/bin:$PATH"`

## 手順

1. **ticket を読む**。「変更ファイル」リスト外は触らない。依存 PR が未 merge なら停止して報告

2. **worktree 作成** (repo 本体の checkout を汚さない):
   ```bash
   bash .claude/scripts/setup-worktree.sh <branch>
   cd "$(git rev-parse --show-toplevel)/../portfolio-wt/<slug>"
   ```

3. **実装**。ticket の実装ポイントに従う。edge runtime 互換 (node:fs 等の静的 import 禁止) を維持

4. **self-critique** (`.claude/patterns/self-critique/SKILL.md` 参照):
   ticket の「想定 reviewer 観点」の persona で自分の diff を批判的に読み、blocker/major があれば修正。最大 2 ループ

5. **検証**:
   ```bash
   yarn lint && yarn test --passWithNoTests && yarn build
   ```

6. **commit / push / PR**:
   ```bash
   git add -A
   git -c commit.gpgsign=false commit -m "<日本語 conventional commit>"
   git push -u origin <branch>
   gh pr create --base develop --head <branch> --title "..." --body "..."
   ```
   PR body は ticket の雛形 (Summary / Test plan / 🤖 Generated with Claude Code)

7. **auto-merge enqueue** (レビュー不要と指示された場合のみ即実行。通常は `/review-pr` の LGTM 後):
   ```bash
   gh pr merge <num> --auto --squash --delete-branch
   ```

8. **報告**: PR URL / 検証結果 / self-critique で直した点 / merge 待ち状態

## 注意

- CONFLICTING になったら worktree 内で `git merge origin/develop` → 解消 → push
- CF Pages / e2e / lhci の CI 失敗は required でない。`test` が green なら merge される
- merge 後の `docs/PROGRESS.md` 更新は別 PR (`/progress-update`)
