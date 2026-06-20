# Resume Instructions

新セッション(ローカル/クラウド/別エージェント)が作業を再開する時の **最初に読むファイル**。

## 1. 現状把握 (必ず最初に実行)

```bash
git -C $(git rev-parse --show-toplevel 2>/dev/null || echo .) fetch origin --prune
git log --oneline origin/develop -20
gh pr list --base develop --json number,title,state,mergeable,mergeStateStatus
```

## 2. SSOT を読む

- [docs/PROGRESS.md](../docs/PROGRESS.md): 完了 PR と次の作業
- [docs/DESIGN_PROPOSAL.md](../docs/DESIGN_PROPOSAL.md): 全体方針
- [.claude/tickets/](./tickets/): 各 PR の仕様

## 3. 環境チェック

```bash
node -v  # >= 20 必須
which gh && gh auth status  # gh は認証済みか
git config --get user.email
```

Node が 18 系の場合:
```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
```

## 4. 次の PR を見つける

`docs/PROGRESS.md` の「Layer 2 (未着手)」セクションを見る。
未着手の logical PR があれば、対応する `.claude/tickets/<branch>.md` を読んで実装開始。

## 5. 開発フロー (PROGRESS.md にも記載)

```bash
REPO=$(git rev-parse --show-toplevel)
BRANCH=feat/case-study-and-dan-indicator  # 例
SLUG=$(echo $BRANCH | tr '/' '-')

git -C $REPO fetch origin develop --prune
git -C $REPO worktree add -B $BRANCH "$REPO/../portfolio-wt/$SLUG" origin/develop
cd "$REPO/../portfolio-wt/$SLUG"
ln -sfn "$REPO/node_modules" node_modules

cat "$REPO/.claude/tickets/$SLUG.md"  # 仕様を読む

# ... 実装 ...

export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build

git add -A
git -c commit.gpgsign=false commit -m "..."
git push -u origin $BRANCH
gh pr create --base develop --head $BRANCH --title "..." --body "..."
```

## 6. レビュー & マージ (auto-merge 無効)

```bash
PR=<番号>
gh pr diff $PR | less

# 専門領域から批判的レビュー → BLOCKER/MAJOR 1件でも REQUEST_CHANGES
gh pr review $PR --approve --body "..." # or --request-changes --body "..."

# auto-merge 無効なので直接 merge
# CI test=pass を確認
until [ "$(gh pr checks $PR --json name,bucket -q '.[]|select(.name=="test")|.bucket')" = "pass" ]; do sleep 30; done

# MERGEABLE を確認 (CONFLICTING なら PM が手動解消)
gh pr view $PR --json mergeable -q '.mergeable'

# マージ実行 (CF Pages 失敗は無視可)
gh pr merge $PR --squash --delete-branch
```

## 7. PROGRESS.md を更新

新しい PR が merge されたら、別 PR で `docs/PROGRESS.md` を更新する。

## 困ったら

- auto-merge 関連エラー: 設定で無効。`--auto` は使えない。直接 merge する
- CF Pages CI が赤: 仕様。test と Vercel が pass なら無視可
- conflict: 別 worktree で `git merge origin/develop` → fix → push
- token 残量が 90% 接近: 停止サマリを出して止める

## クラウドエージェントの場合

クラウド CCR セッションは:
- ローカル `/Users/k23087kk/...` パスを持たない (`$(git rev-parse --show-toplevel)` で動的解決すること)
- `/tmp/portfolio-wt/` も持たない (新規 worktree を作る)
- `Workflow` ツール(pipeline 並列実装)は **使えない** → `Agent` ツールで 1 PR ずつ順次実装
- 単一エージェントなので self-critique パターンを使う(impl 後に別 persona で critique → fix)
