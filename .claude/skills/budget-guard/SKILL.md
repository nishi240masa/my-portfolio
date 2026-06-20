# budget-guard

> Workflow / 長時間エージェントセッションで **budget (token / time)** を意識した停止判断パターン。

## 目的

Workflow script で `budget.spent()` / `budget.remaining()` を読み、phase をスキップしたりループを早期終了したりして、コンテキスト枯渇による中途半端な PR を防ぐ。

## いつ使うか

- Workflow script で複数 phase (impl → critique → fix → push) を回す時
- self-critique を `while` ループで回す時
- 1 セッションで 複数 PR を順次実装する時

## 基本 API (Workflow script 想定)

```js
budget.spent()      // 既に使ったトークン (number)
budget.remaining()  // 残り (number)
budget.total()      // 上限
```

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
