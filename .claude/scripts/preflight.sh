#!/usr/bin/env bash
# preflight.sh — 新セッション開始時の環境/リポジトリ状態チェック (READ-ONLY)
#
# 目的: 新セッション(ローカル/クラウド/別エージェント)が作業を始める前に、
#       環境とリポジトリの状態を一括で確認する。副作用なし、check only。
#
# Usage:
#   bash .claude/scripts/preflight.sh

set -u

# nodebrew の Node 20 を優先 (ローカル開発環境向け)
if [ -d "/Users/k23087kk/.nodebrew/current/bin" ]; then
  export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
fi

# 色 (TTY のみ)
if [ -t 1 ]; then
  C_BOLD="\033[1m"
  C_DIM="\033[2m"
  C_RED="\033[31m"
  C_GREEN="\033[32m"
  C_YELLOW="\033[33m"
  C_RESET="\033[0m"
else
  C_BOLD=""; C_DIM=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_RESET=""
fi

print_section() {
  printf "\n${C_BOLD}== %s ==${C_RESET}\n" "$1"
}

print_kv() {
  # key: value (key を左寄せ揃え)
  printf "  %-24s : %s\n" "$1" "$2"
}

print_notice() {
  printf "${C_YELLOW}  ! %s${C_RESET}\n" "$1"
}

print_ok() {
  printf "${C_GREEN}  ok${C_RESET}  %s\n" "$1"
}

print_warn() {
  printf "${C_YELLOW}  warn${C_RESET}  %s\n" "$1"
}

print_err() {
  printf "${C_RED}  err${C_RESET}   %s\n" "$1"
}

# ---------------- 1. Environment ----------------
print_section "Environment"

# Node
if command -v node >/dev/null 2>&1; then
  NODE_V=$(node -v 2>/dev/null || echo "unknown")
  NODE_MAJOR=$(echo "$NODE_V" | sed -E 's/^v([0-9]+).*/\1/')
  print_kv "node" "$NODE_V"
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 20 ] 2>/dev/null; then
    print_ok "node >= 20"
  else
    print_err "node < 20 (この repo は >= 20 が必要)"
    print_notice "export PATH=\"/Users/k23087kk/.nodebrew/current/bin:\$PATH\" を実行してください"
  fi
else
  print_err "node not found"
fi

# yarn
if command -v yarn >/dev/null 2>&1; then
  YARN_V=$(yarn -v 2>/dev/null || echo "unknown")
  print_kv "yarn" "$YARN_V"
else
  print_warn "yarn not found"
fi

# git
if command -v git >/dev/null 2>&1; then
  GIT_V=$(git --version 2>/dev/null | awk '{print $3}')
  print_kv "git" "$GIT_V"
else
  print_err "git not found"
fi

# gh
if command -v gh >/dev/null 2>&1; then
  GH_V=$(gh --version 2>/dev/null | head -1 | awk '{print $3}')
  print_kv "gh" "$GH_V"
  GH_AUTH=$(gh auth status 2>&1 | grep -E "Logged in|not logged" | head -1)
  if echo "$GH_AUTH" | grep -q "Logged in"; then
    print_ok "gh auth: $(echo "$GH_AUTH" | sed 's/^[[:space:]]*//')"
  else
    print_err "gh not authenticated — run: gh auth login"
  fi
else
  print_err "gh not found"
fi

# ---------------- 2. Repository ----------------
print_section "Repository"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [ -z "$REPO_ROOT" ]; then
  print_err "not inside a git repository"
  exit 1
fi
print_kv "repo root" "$REPO_ROOT"

# OWNER/REPO を gh から動的取得
OWNER_REPO=$(gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"' 2>/dev/null || echo "")
if [ -n "$OWNER_REPO" ]; then
  OWNER=$(echo "$OWNER_REPO" | cut -d'/' -f1)
  REPO=$(echo "$OWNER_REPO" | cut -d'/' -f2)
  print_kv "owner/repo" "$OWNER_REPO"
else
  OWNER=""
  REPO=""
  print_warn "gh repo view failed (offline?)"
fi

# 現在ブランチ
CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
print_kv "current branch" "$CUR_BRANCH"

# git status --short
print_section "Working tree (git status --short)"
GIT_STATUS=$(git status --short 2>/dev/null)
if [ -z "$GIT_STATUS" ]; then
  print_ok "clean"
else
  echo "$GIT_STATUS" | sed 's/^/  /'
fi

# ---------------- 3. origin/develop との差分 ----------------
print_section "Diff vs origin/develop"

# fetch は重いので silent (failure 無視)
git fetch origin develop --prune >/dev/null 2>&1 || true

if git rev-parse --verify origin/develop >/dev/null 2>&1; then
  AHEAD=$(git rev-list --count origin/develop..HEAD 2>/dev/null || echo "?")
  BEHIND=$(git rev-list --count HEAD..origin/develop 2>/dev/null || echo "?")
  print_kv "ahead of develop" "$AHEAD"
  print_kv "behind develop" "$BEHIND"
  echo ""
  echo "  recent develop commits:"
  git log --oneline origin/develop -5 2>/dev/null | sed 's/^/    /'
else
  print_warn "origin/develop not found (fetch failed?)"
fi

# ---------------- 4. Open PRs ----------------
print_section "Open PRs (base: develop)"

if [ -n "$OWNER_REPO" ]; then
  PR_LIST=$(gh pr list --base develop --json number,title,headRefName,mergeable,mergeStateStatus --jq '.[] | "  #\(.number) [\(.mergeable)/\(.mergeStateStatus)] \(.headRefName) — \(.title)"' 2>/dev/null || echo "")
  if [ -z "$PR_LIST" ]; then
    print_ok "no open PRs"
  else
    echo "$PR_LIST"
  fi
else
  print_warn "skipped (no gh repo context)"
fi

# ---------------- 5. Repo settings ----------------
print_section "Repo settings"

if [ -n "$OWNER_REPO" ]; then
  REPO_SETTINGS=$(gh api -X GET "/repos/$OWNER_REPO" --jq '{allow_auto_merge, allow_squash_merge, allow_merge_commit, allow_rebase_merge}' 2>/dev/null || echo "")
  if [ -n "$REPO_SETTINGS" ]; then
    echo "$REPO_SETTINGS" | sed 's/^/  /'
  else
    print_warn "gh api repo settings failed"
  fi
else
  print_warn "skipped (no gh repo context)"
fi

# ---------------- 6. Branch protection (develop) ----------------
print_section "Branch protection (develop)"

if [ -n "$OWNER_REPO" ]; then
  # gh api を一度呼んで raw JSON を取得 (stderr は捨てる)。
  # not protected な branch は status:404 のエラー JSON を返す。
  PROTECTION_RAW=$(gh api -X GET "/repos/$OWNER_REPO/branches/develop/protection" 2>/dev/null || true)

  if [ -z "$PROTECTION_RAW" ]; then
    print_kv "protection" "unreachable (gh api failed silently)"
  elif echo "$PROTECTION_RAW" | grep -q '"status":"404"'; then
    print_kv "protection" "not protected"
  elif echo "$PROTECTION_RAW" | grep -q '"message":"Branch not protected"'; then
    print_kv "protection" "not protected"
  else
    # 保護されているなら詳細を表示
    REQUIRED=$(gh api -X GET "/repos/$OWNER_REPO/branches/develop/protection" --jq '.required_status_checks // "none"' 2>/dev/null || echo "")
    if [ -z "$REQUIRED" ] || [ "$REQUIRED" = "none" ] || [ "$REQUIRED" = "null" ]; then
      print_kv "required_status_checks" "none"
    else
      echo "  required_status_checks:"
      echo "$REQUIRED" | sed 's/^/    /'
    fi

    CONTEXTS=$(gh api -X GET "/repos/$OWNER_REPO/branches/develop/protection" --jq '.required_status_checks.contexts // []' 2>/dev/null || echo "[]")
    if [ "$CONTEXTS" != "[]" ] && [ -n "$CONTEXTS" ] && [ "$CONTEXTS" != "null" ]; then
      echo "  required check contexts:"
      echo "$CONTEXTS" | sed 's/^/    /'
    fi
  fi
else
  print_warn "skipped (no gh repo context)"
fi

# ---------------- 7. Notices ----------------
print_section "Notices"

print_notice "CF Pages CI は永続的に失敗します。test=pass のみ確認すれば merge 可能"
print_notice "Node が 18 系なら: export PATH=\"/Users/k23087kk/.nodebrew/current/bin:\$PATH\""

echo ""
printf "${C_DIM}preflight complete.${C_RESET}\n"
