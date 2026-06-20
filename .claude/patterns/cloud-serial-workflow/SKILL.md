# cloud-serial-workflow

> クラウド CCR (Workflow ツール使用不可) で複数エージェントを **シリアル** に回す代替パターン。

## 目的

ローカル Claude Code では Workflow ツールで impl / review / merge を並列・順次に編成できるが、クラウド CCR では Workflow が使えない (or 制限される) ことがある。
そういう環境で `Agent` ツール (`subagent_type="general-purpose"`) を **手動で呼び分け** て同等のパイプラインを作るためのパターン集。

## いつ使うか

- クラウドの Claude Code 環境で PR を作る時
- 1 つのチャットセッション内で impl → review → merge を別エージェントに分けたい時
- 並列レビューが不要な小〜中規模 PR

## 基本構造

```
[orchestrator (あなた)]
  └─ Agent(impl)        # 実装する
  └─ Agent(review)      # diff を読んでレビュー
  └─ Agent(merge)       # 修正 / マージ / PR 更新
```

各 Agent は独立した context window を持つ。SSOT を共有することで疎結合に保つ。

### SSOT: `.claude/tickets/<branch>.md`

ticket ファイルを **唯一の真実** とする。各 Agent はこれを冒頭で読み込む。
変更があれば ticket ファイル自体を更新して次の Agent に渡す。

## サンプル prompt 集

### 1. impl agent

```
あなたは実装エージェントです。

[セットアップ]
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
cd /Users/k23087kk/src/my-portfolio
git fetch origin develop --prune
git worktree add -B <branch> ../portfolio-wt/<slug> origin/develop
cd ../portfolio-wt/<slug>
ln -sfn /Users/k23087kk/src/my-portfolio/node_modules node_modules

[仕様]
.claude/tickets/<branch>.md を読み、acceptance criteria を満たす実装をする。

[検証]
yarn lint && yarn test (任意) && yarn build (任意)

[終了]
git add -A && git commit && git push -u origin <branch>
gh pr create --base develop --title "..." --body "..."

[返答]
{ branch, prNumber, prUrl, lintOk, testOk, buildOk, notes, failures }
```

### 2. review agent (別呼び出し)

```
あなたは review エージェントです。直前の impl エージェントが上げた PR をレビューします。

[コンテキスト]
- PR: #<prNumber>
- branch: <branch>
- ticket: .claude/tickets/<branch>.md (acceptance criteria)
- reviewerFocus: <a11y | perf | architect | security>

[手順]
1. gh pr diff <prNumber> で diff を取得
2. ticket と照合
3. persona の観点で blocker / major / minor を列挙
4. gh pr review でコメント (--comment / --request-changes) または返り値で報告

[返答]
{ blockers: [...], majors: [...], minors: [...], verdict: "approve" | "request_changes" }
```

### 3. merge / fix agent (review 結果を受けて)

```
あなたは fix-and-merge エージェントです。

[入力]
- PR: #<prNumber>
- review 結果: <review agent の出力 JSON>

[手順]
1. blockers / majors を 1 件ずつ修正してコミット
2. 全部解消したら gh pr merge --squash --delete-branch
3. 解消できない既知事項は PR body に追記してから merge

[返答]
{ merged: bool, mergedSha, remainingKnownIssues: [...] }
```

## 並列したい時 (Anthropic API レベルの並列)

Workflow は使えないが、**同一メッセージ内で複数 Agent ツール呼び出しを並列発火** すると、Anthropic API レベルで並列実行されることが **期待できます** (Claude Code のドキュメント上はサポートと記載されている)。

ただしこの並列性は **環境依存** です。次の点に注意:

- 実際に並列で走っているかは **dry-run でログ (各 Agent の開始/終了時刻) を確認** しないと分からない (タイムスタンプが overlap していれば並列、ほぼ重ならず逐次なら serial)
- ランタイム / バージョン / 同時実行制限 / rate limit によっては **暗黙的に serial 化** されることがある
- serial 化された場合、合計実行時間が伸びるだけでなく、**N 個の Agent 分の context budget が累積で消費** されるため、想定の倍以上消費される可能性がある (1 セッション内の累積)
- 並列性が必要な要件 (e.g. 「N 時間以内に終わらせる」) の場合は事前に小規模 dry-run で実測すること

例: 3 つの独立 PR を並列実装 (期待):

```
# 1 メッセージ内に Agent ツール呼び出しを 3 つ並べる
Agent(subagent_type="general-purpose", prompt="ticket A を実装し PR を上げる ...")
Agent(subagent_type="general-purpose", prompt="ticket B を実装し PR を上げる ...")
Agent(subagent_type="general-purpose", prompt="ticket C を実装し PR を上げる ...")
```

各 Agent は独立 worktree (`../portfolio-wt/<slug>`) を作るので衝突しない。

ただし:
- 依存関係のある PR (B が A をベースにする) は **シリアルにする**
- review → fix のような前後依存もシリアル
- 並列で動かす時は ticket / worktree 名が確実にユニークである事を確認
- 上記の通り、serial 化された場合の budget 倍増に備えて budget-guard と組み合わせる

## SSOT 運用上の注意

- 各 Agent は冒頭で必ず `.claude/tickets/<branch>.md` を読む
- 仕様が変わった時は **ticket ファイル本体を更新** してコミット (口伝で次 Agent に渡さない)
- progress 全体は `docs/PROGRESS.md`、設計は `docs/DESIGN_PROPOSAL.md` を参照

## チェックリスト (orchestrator として動く時)

- [ ] PR 単位で ticket ファイルが存在するか
- [ ] impl Agent に渡す prompt に SSOT パス / セットアップ / 検証 / 終了条件が入っているか
- [ ] review Agent に reviewerFocus を明示しているか
- [ ] merge Agent に review 結果 JSON を渡しているか
- [ ] 並列発火するなら依存関係がない事を確認したか

## 関連

- [self-critique](../self-critique/SKILL.md): review Agent を別途立てられない時のフォールバック
- [budget-guard](../budget-guard/SKILL.md): Workflow 内では使えるが、クラウド CCR では orchestrator (人 or 上位 Agent) が代わりに残量判断する
