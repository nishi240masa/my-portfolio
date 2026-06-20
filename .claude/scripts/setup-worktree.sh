#!/usr/bin/env bash
# setup-worktree.sh — 新規ブランチの worktree を一発で作成
#
# 引数1つで以下を実行:
#   - origin/develop を fetch
#   - $REPO/../portfolio-wt/<slug>/ に worktree を作成 (origin/develop ベース)
#   - node_modules を symlink (yarn install 不要)
#
# Usage:
#   bash .claude/scripts/setup-worktree.sh <branch-name>
#
# Example:
#   bash .claude/scripts/setup-worktree.sh feat/case-study

set -euo pipefail

# ---- 引数チェック ----
if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  cat <<'USAGE'
Usage: bash .claude/scripts/setup-worktree.sh <branch-name>

Arguments:
  <branch-name>   新規作成するブランチ名 (例: feat/case-study)
                  '/' は slug 化のため '-' に置換され、worktree path に使われる

Example:
  bash .claude/scripts/setup-worktree.sh feat/case-study
  → 作成される worktree: $REPO/../portfolio-wt/feat-case-study/
USAGE
  exit 1
fi

BRANCH="$1"
SLUG=$(printf '%s' "$BRANCH" | tr '/' '-')

# ---- repo root を解決 ----
# worktree 内から実行されても main repo に行けるよう、git-common-dir 経由でも解決する。
REPO=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [ -z "$REPO" ]; then
  echo "error: not inside a git repository" >&2
  exit 1
fi

# worktree 内のとき --show-toplevel は worktree のパスを返すので、
# main repo を git-common-dir (=メイン .git の場所) から逆算する。
GIT_COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null || echo "")
if [ -n "$GIT_COMMON_DIR" ]; then
  # 絶対パス化
  case "$GIT_COMMON_DIR" in
    /*) ABS_COMMON_DIR="$GIT_COMMON_DIR" ;;
    *)  ABS_COMMON_DIR="$(cd "$GIT_COMMON_DIR" 2>/dev/null && pwd)" || ABS_COMMON_DIR="" ;;
  esac
  if [ -n "$ABS_COMMON_DIR" ]; then
    # .git の親 = main repo root
    MAIN_REPO=$(dirname "$ABS_COMMON_DIR")
    if [ -d "$MAIN_REPO" ]; then
      REPO="$MAIN_REPO"
    fi
  fi
fi

# WT_BASE は REPO の親ディレクトリ配下に正規化 (".." を解決した絶対パスにする)
WT_BASE="$(cd "$REPO/.." && pwd)/portfolio-wt"
WT_PATH="$WT_BASE/$SLUG"

# 既存 worktree のチェック
if [ -e "$WT_PATH" ]; then
  echo "error: worktree path already exists: $WT_PATH" >&2
  echo "       既存を削除するには: git -C $REPO worktree remove $WT_PATH" >&2
  exit 1
fi

mkdir -p "$WT_BASE"

# ---- fetch & worktree 作成 ----
echo "==> git fetch origin develop --prune"
git -C "$REPO" fetch origin develop --prune

echo "==> git worktree add -B $BRANCH $WT_PATH origin/develop"
git -C "$REPO" worktree add -B "$BRANCH" "$WT_PATH" origin/develop

# ---- node_modules を symlink ----
if [ -d "$REPO/node_modules" ]; then
  echo "==> ln -sfn $REPO/node_modules node_modules"
  ln -sfn "$REPO/node_modules" "$WT_PATH/node_modules"
else
  echo "warn: $REPO/node_modules が存在しません。worktree 内で yarn install が必要かもしれません" >&2
fi

# ---- 完了メッセージ ----
echo ""
echo "============================================================"
echo "  worktree ready: $WT_PATH"
echo "============================================================"
echo ""
echo "次のコマンド例:"
echo "  cd $WT_PATH"

TICKET_PATH="$REPO/.claude/tickets/$SLUG.md"
if [ -f "$TICKET_PATH" ]; then
  echo "  cat $REPO/.claude/tickets/$SLUG.md   # 仕様を読む"
else
  echo "  # 仕様 ticket: $TICKET_PATH (まだありません)"
fi

cat <<HINT

  # 実装後の流れ (Node 20+ が PATH にある前提):
  yarn lint && yarn test --passWithNoTests && yarn build
  git add -A
  git -c commit.gpgsign=false commit -m "..."
  git push -u origin $BRANCH
  gh pr create --base develop --head $BRANCH --title "..." --body "..."
HINT
