# Tickets

各 PR の **実装仕様の SSOT**。会話 context に依存せず、誰が見ても同じ実装に到達できることを目指す。

## ファイル命名規則

ファイル名 = ブランチ名の `/` を `-` に置換:
- branch `feat/case-study-and-dan-indicator`
- ticket file `feat-case-study-and-dan-indicator.md`

## 構造

1 ファイル 1 PR。テンプレは [_TEMPLATE.md](./_TEMPLATE.md)。

各 ticket は以下を含む:
- **ゴール**: 何を達成するか (1-3文)
- **変更ファイル**: 触ってよいファイルの全リスト (それ以外は触らない)
- **禁止事項**: スコープ外として明示的に触らないもの
- **検証**: lint/test/build コマンド
- **コミット & PR**: メッセージとボディの雛形
- **レビュー観点**: どの専門領域で批判的にレビューさせるか
- **依存**: 他 PR への依存があれば明記

## 使い方

実装エージェント:
```bash
cat .claude/tickets/<branch>.md
```
仕様を読んでから実装開始。仕様に書かれていないものは触らない。

レビュアー:
```bash
cat .claude/tickets/<branch>.md  # 仕様
gh pr diff <num>                 # 実装
```
仕様遵守 + スコープ外混入 + 専門領域の欠陥 をチェック。

## 既存チケット

| Ticket | Status |
|---|---|
| [feat-case-study-and-dan-indicator.md](./feat-case-study-and-dan-indicator.md) | ✅ 実装済クローズ (#15/#18/#25/#26 + follow-up #41) |
| [chore-claude-skills-and-structure.md](./chore-claude-skills-and-structure.md) | ✅ merged (#39) |
| [refactor-case-study-editor-nits.md](./refactor-case-study-editor-nits.md) | ✅ merged (#41) |
| [fix-ci-site-url-e2e-lhci.md](./fix-ci-site-url-e2e-lhci.md) | ✅ merged (#42) |
| [fix-e2e-suite-failures.md](./fix-e2e-suite-failures.md) | ✅ 3 系統解消 (#43 系統1 / #44 系統2 / #45 系統3) |
| [chore-claude-agents-definitions.md](./chore-claude-agents-definitions.md) | 未着手 |
