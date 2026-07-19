---
name: review-pr
description: PR を専門 persona で批判的にレビューする (仕様遵守 / scope 外混入 / 専門領域の欠陥 / 既存破壊 / セキュリティ)。「PR をレビューして」「#N を見て」と言われた時、または /impl-pr・/wave の後段で使う。
argument-hint: <PR 番号>
---

# review-pr — persona ベース批判的レビュー

## 手順

1. **仕様と実装を突き合わせる**:
   ```bash
   gh pr view <num> --json title,body,headRefName
   cat .claude/tickets/<head-branch-slug>.md   # 仕様 SSOT
   gh pr diff <num>
   ```

2. **persona を選ぶ**: ticket の「想定 reviewer 観点」に従い、**実装者と別人格** で読む
   - **A11y**: alt / aria-* / フォーカス管理 / コントラスト (WCAG 1.4.x)
   - **Perf/SEO**: next/image / metadata / OGP / Core Web Vitals / ISR・キャッシュ粒度
   - **アーキテクト**: 責務境界 / 型の漏れ / 重複 / 命名一貫性 / edge runtime 互換
   - **UX**: 状態遷移 / エラー表示 / フォーム挙動
   - **セキュリティ**: 入力検証 (Zod) / XSS / CSRF / Cookie / 秘密情報の混入

3. **必須チェック** (persona に関わらず):
   - ticket の「変更ファイル」外への変更が混入していないか
   - 「禁止事項」に違反していないか
   - 既存破壊 (import 経路 / 型 / public API)
   - edge bundle に `node:*` が静的 import で混入していないか

4. **判定**: severity を blocker / major / minor で分類
   - **blocker/major が 1 件でもあれば** REQUEST_CHANGES:
     ```bash
     gh pr review <num> --request-changes --body "<severity 別の指摘リスト>"
     ```
   - 無ければ approve + auto-merge enqueue:
     ```bash
     gh pr review <num> --approve --body "<確認した観点の要約>"
     gh pr merge <num> --auto --squash --delete-branch
     ```

## 注意

- 「動くから OK」ではなく **仕様と観点に照らして** 判定する。指摘ゼロの approve には確認した観点を必ず書く
- minor は PR コメントに残すか TODO 化し、merge は阻まない
