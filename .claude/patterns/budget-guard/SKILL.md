# budget-guard

> Workflow / 長時間エージェントセッションで **budget (token / time)** を意識した停止判断パターン。

> **⚠️ 重要: これは概念モデル / pseudocode です。**
> 本ドキュメントで参照している `budget.spent()` / `budget.remaining()` / `budget.total()` といった API は、Workflow runtime のバージョン / 環境 / SDK によって名前やシグネチャに差異があります。
> このパターンを実装に取り入れる前に、**必ず利用する Workflow runtime の actual API を確認** してください。
> もし対応する API が存在しない環境では、`budget.remaining()` 呼び出しを **manual な context-window 観察** (例: 直近の応答 token 数を手動カウント、`/cost` 等のコマンド、orchestrator 側のログ) で代用してください。後段の各パターンは「残量を取れる」という前提さえ満たせばロジックはそのまま流用できます。

## 目的

Workflow script で `budget.spent()` / `budget.remaining()` を読み、phase をスキップしたりループを早期終了したりして、コンテキスト枯渇による中途半端な PR を防ぐ。

## いつ使うか

- Workflow script で複数 phase (impl → critique → fix → push) を回す時
- self-critique を `while` ループで回す時
- 1 セッションで 複数 PR を順次実装する時

## 基本 API (Workflow script 想定 — 概念モデル)

```js
budget.spent()      // 既に使ったトークン (number)
budget.remaining()  // 残り (number)
budget.total()      // 上限
```

これらは **本ドキュメント内で用いる概念的な関数名** であり、実 runtime での実 API 名は異なる場合があります (例: `context.budget.tokensRemaining`, `session.usage.remaining`, あるいは関数ではなくプロパティ等)。利用前に必ず実装の有無 / シグネチャを確認してください。

**実装が存在しない場合の代用例:**
- orchestrator が手動で「ここまでで応答 N 回 / 平均 X token / 累計 Y token」を概算してログに残す
- Claude Code 側の `/cost` または同等コマンドで残量を可視化し、人間 or 上位 Agent が判断する
- 各 phase 終了後に `wc` 等で「直近の出力 size」を測り、これを近似値として使う

具体的な閾値はモデル / 構成依存だが、**目安として 50_000 トークン** を「次 phase を走らせるのに最低限必要な量」と見なすのが扱いやすい。

## パターン 1: phase 間ガード

```js
// phase 1: impl
await runAgent({ persona: "impl", prompt: implPrompt });
log(`after impl: remaining=${budget.remaining()}`);

if (budget.remaining() < 50_000) {
  log("budget low — skipping critique, pushing as-is");
  await runAgent({ persona: "push", prompt: pushPrompt });
  return;
}

// phase 2: self-critique
await runAgent({ persona: "critique", prompt: critiquePrompt });
log(`after critique: remaining=${budget.remaining()}`);
```

## パターン 2: ループ条件に budget を入れる

self-critique loop を回す時:

```js
let iteration = 0;
const MAX_ITER = 2;

while (iteration < MAX_ITER && budget.remaining() > 50_000) {
  const result = await runAgent({ persona: "critique", prompt: critiquePrompt });
  if (result.blockers.length === 0 && result.majors.length === 0) break;

  await runAgent({ persona: "fix", prompt: fixPrompt(result) });
  iteration += 1;
  log(`loop ${iteration}: remaining=${budget.remaining()}`);
}

if (budget.remaining() <= 50_000) {
  log("stopped loop due to budget — recording known issues in PR body");
}
```

## パターン 3: 複数 PR を順次回す時の停止判断

```js
const tickets = ["feat/a", "feat/b", "feat/c"];

for (const ticket of tickets) {
  if (budget.remaining() < 150_000) {
    log(`skipping ${ticket} — need ~150k for a full PR, have ${budget.remaining()}`);
    break;
  }
  await implementTicket(ticket);
  log(`done ${ticket}: remaining=${budget.remaining()}`);
}
```

## ログ表示の推奨

phase の境目で必ず `log()` を呼んで残量を可視化:

```js
log(`[phase=impl   ] spent=${budget.spent()} remaining=${budget.remaining()}`);
log(`[phase=review ] spent=${budget.spent()} remaining=${budget.remaining()}`);
log(`[phase=push   ] spent=${budget.spent()} remaining=${budget.remaining()}`);
```

後から「どの phase が重かったか」を振り返れる。

## 注意

- `budget.remaining()` は API レスポンス到着後に更新される。**phase 開始直前** に判定するのが正確
- 閾値 (50_000 / 150_000) はあくまで目安。プロジェクトの 1 phase 平均消費を計測して調整する
- budget 切れで止まった時は **必ず PR 本文か progress file に「途中で停止した理由」** を書く

## 関連

- [self-critique](../self-critique/SKILL.md): ループ部分でこの skill を組み合わせる
- [cloud-serial-workflow](../cloud-serial-workflow/SKILL.md): Workflow が使えない環境では budget API も使えないため、人間 (またはオーケストレータ) が代わりに残量判断する
