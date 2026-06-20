# self-critique

> 単一エージェントでも品質を担保するための **impl → self-critique → fix** ループ。

## 目的

並列レビュー (Workflow ツールで reviewer エージェントを別途立てる) が **使えない環境** (クラウド CCR / 単一エージェント) で品質ゲートを保つためのパターン。

実装エージェント自身が persona を切り替えて自分の diff を読み返し、blocker/major を発見したら修正する。

## いつ使うか

- クラウド CCR (Workflow ツール不可) で PR を作る時
- ローカルでも、Workflow を起動するほどでない小規模変更を 1 エージェントで完結させたい時
- レビュアーが別 persona で見ると気付ける観点 (a11y / perf / SEO / 型 / セキュリティ) を意識的に通したい時

## 使い方

### 1. 通常通り実装する

ticket / spec 通りに変更を書き、lint / test / build を通す。

### 2. persona を切り替える

`.claude/tickets/<branch>.md` の `reviewerFocus` 欄、または spec が示すレビュー観点に応じて **別人格** で diff を読む。

レビュー persona の例:
- **A11y reviewer**: alt 属性 / aria-* / フォーカス管理 / コントラスト
- **Perf/SEO reviewer**: Next.js Image 最適化 / metadata / OGP / Core Web Vitals 影響
- **アーキテクト**: app/components/data の責務境界 / 型の漏れ / 重複 / 命名一貫性
- **Security reviewer**: 入力検証 / XSS / 認証フロー / 秘密情報の混入

### 3. blocker/major を 1 件でも見つけたら修正 → 再 critique

- **blocker**: 機能不全 / a11y 違反 / build 通らない
- **major**: 仕様逸脱 / 明らかな性能/SEO 退行 / 型の漏れ
- **minor**: スタイル / 命名揺れ (PR に残すか TODO 化)

### 4. 最大 2 ループまで

- それでも残る blocker/major があれば、PR 本文に **既知事項** として明記して上げる
- レビュー persona ごとに 1 ループずつ回すと安定 (例: A11y で 1 周 → Perf で 1 周)

## エージェント prompt テンプレ

`general-purpose` Agent ツール / Task で self-critique フェーズを呼ぶ時の prompt 雛形:

```
あなたは self-critique reviewer です。直前の実装エージェントが書いた diff をレビューします。

[コンテキスト]
- ブランチ: <branch>
- ticket: .claude/tickets/<branch>.md
- 変更ファイル: <list>

[persona]
<reviewerFocus に応じた persona を 1 つ選ぶ。例: "A11y reviewer">

[手順]
1. `git diff origin/develop...HEAD` を読む
2. ticket の acceptance criteria と照らし合わせる
3. persona の観点で blocker / major / minor を列挙
4. blocker か major が 1 件でもあれば、ファイル/行/根拠 を明記して返す
5. なければ "no blockers" と返す

[出力フォーマット]
- blockers: [...]
- majors: [...]
- minors: [...] (任意)
```

その出力を受けて、実装エージェントが修正 → 再 critique を回す。

## 注意

- self-critique は **完璧ではない** (同じモデル / 同じコンテキスト寄りの盲点はそのまま残る)
- 重要な PR は人間レビューか別エージェントによる review に必ず通す
- このパターンは「何もレビューしないより遥かにマシ」を狙うフォールバック

## 関連

- [cloud-serial-workflow](../cloud-serial-workflow/SKILL.md): クラウドで impl と review を別エージェント呼び出しに分割するパターン
- [budget-guard](../budget-guard/SKILL.md): Workflow 内で self-critique ループの残量を見て止める方法
