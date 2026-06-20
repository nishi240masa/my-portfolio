# Resume Instructions

新セッション(ローカル/クラウド/別エージェント)が作業を再開する時の **最初に読むファイル**。

## 1. 現状把握 (必ず最初に実行)

```bash
bash .claude/scripts/preflight.sh
```

このスクリプトは READ-ONLY で以下を一括表示する:
- Node/yarn/gh のバージョンと認証状態
- 現在ブランチ + `git status --short`
- `origin/develop` との ahead/behind
- open PRs (`gh pr list --base develop`)
- リポジトリ設定 (`allow_auto_merge` / `allow_squash_merge` 等)
- develop の branch protection と required status checks
- 既知の notice (CF Pages CI は永続失敗、auto-merge 無効 等)

手動で個別に確認したい場合は以下:
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

worktree のセットアップは一行で:

```bash
bash .claude/scripts/setup-worktree.sh feat/case-study  # 例
```

このスクリプトは以下を自動で実行する:
- `git fetch origin develop --prune`
- `git worktree add -B <branch> $REPO/../portfolio-wt/<slug> origin/develop`
- `node_modules` を repo root から symlink (yarn install 不要)
- 仕様 ticket のパスと次のコマンド例を表示

続きの実装〜PR 作成:

```bash
cd "$REPO/../portfolio-wt/<slug>"
cat "$REPO/.claude/tickets/<slug>.md"  # 仕様を読む

# ... 実装 ...

export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build

git add -A
git -c commit.gpgsign=false commit -m "..."
git push -u origin <branch>
gh pr create --base develop --head <branch> --title "..." --body "..."
```

## 6. レビュー & マージ (auto-merge 有効化済 / 2026-06-20)

```bash
PR=<番号>
gh pr diff $PR | less

# 専門領域から批判的レビュー → BLOCKER/MAJOR 1件でも REQUEST_CHANGES
gh pr review $PR --approve --body "..." # or --request-changes --body "..."

# auto-merge 有効。enqueue するだけで CI green を待って自動マージされる (polling 不要)
gh pr merge $PR --auto --squash --delete-branch

# 即時 merge したい場合は --auto を外す:
#   gh pr merge $PR --squash --delete-branch
# (CONFLICTING なら PM が手動解消。CF Pages 失敗は required check ではないので無視可)
```

## 7. PROGRESS.md を更新

新しい PR が merge されたら、別 PR で `docs/PROGRESS.md` を更新する。

## 困ったら

- auto-merge 関連エラー: 2026-06-20 に有効化済み。`gh pr merge --auto --squash --delete-branch` が使える。即時 merge したい場合は `--auto` を外す
- CF Pages CI が赤: 仕様。test と Vercel が pass なら無視可
- conflict: 別 worktree で `git merge origin/develop` → fix → push
- token 残量が 90% 接近: 停止サマリを出して止める

## クラウドエージェントの場合

クラウド CCR セッションは:
- ローカル `/Users/k23087kk/...` パスを持たない (`$(git rev-parse --show-toplevel)` で動的解決すること)
- `/tmp/portfolio-wt/` も持たない (新規 worktree を作る)
- `Workflow` ツール(pipeline 並列実装)は **使えない** → `Agent` ツールで 1 PR ずつ順次実装
- 単一エージェントなので self-critique パターンを使う(impl 後に別 persona で critique → fix)
