---
name: ticket
description: 新しい PR 用の実装仕様 ticket を .claude/tickets/ に作成する。「ticket を切って」「この作業を仕様化して」と言われた時、または /wave・/impl-pr の前段で PR 仕様を固める時に使う。
argument-hint: <branch-name> <ゴールの説明>
---

# ticket — PR 仕様チケット作成

`.claude/tickets/` は各 PR の実装仕様 SSOT。会話 context に依存せず、誰が読んでも同じ実装に到達できる粒度で書く。

## 手順

1. `.claude/tickets/_TEMPLATE.md` を読み、構造に従う
2. ファイル名 = ブランチ名の `/` を `-` に置換 (branch `feat/xxx-yyy` → `feat-xxx-yyy.md`)
3. 以下を **具体的に** 埋める (曖昧なら実装前にコードを読んで確定させる):
   - **ゴール**: 1-3 文。何を・なぜ
   - **変更ファイル**: 触ってよいファイルの全リスト。「これ以外は触らない」が効くのはリストが正確な時だけ
   - **禁止事項**: scope 外として明示的に触らないもの + 理由
   - **実装ポイント**: API シグネチャ / 型 / エッジケース / 既存破壊の注意点
   - **依存**: 他 PR が先に develop に入っている必要があれば PR 番号で明記 (→ /wave の DAG に使われる)
   - **想定 reviewer 観点**: Performance/SEO / A11y / アーキテクト / UX / セキュリティ から選ぶ (→ /review-pr の persona に使われる)
4. `.claude/tickets/README.md` の「既存チケット」表に行を追加 (Status: 未着手)

## 品質基準

- 変更ファイルのパスは実在確認する (typo った ticket は実装エージェントを迷子にする)
- 検証コマンドは定型: `export PATH="$HOME/.nodebrew/current/bin:$PATH" && yarn lint && yarn test --passWithNoTests && yarn build`
- 大きすぎる ticket は分割を提案する (目安: 変更ファイル 10 個超 or 独立して merge 可能な単位が複数)
