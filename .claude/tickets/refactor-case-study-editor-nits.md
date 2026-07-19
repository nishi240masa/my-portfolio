# refactor-case-study-editor-nits

## メタ

- **branch**: `refactor/case-study-editor-nits`
- **base**: `develop`
- **PR title**: `refactor(admin): CaseStudy Editor の metrics/links を安定 key 化 + metrics 上限 UI`
- **依存**: なし (feat-case-study-and-dan-indicator は #15/#17/#18/#25/#26 で実装済。本 PR はその follow-up nit)
- **想定 reviewer 観点**: React 正当性 (key) / UX

## 背景

`feat-case-study-and-dan-indicator` チケット本体は develop に統合済。精査の結果、実装ポイント/PROGRESS.md Follow-up に残っていた 2 点の nit のみ未対応だったため本 PR で片付ける。

- `MetricsEditor` / `LinksEditor` が `key={i}` (配列 index) を使用 → 途中行の削除で React が別行を再利用し、入力中フォーカス/値がずれる潜在バグ (PROGRESS.md Follow-up 明記)
- metrics の追加が無制限 → ticket 実装ポイント「最大 4 件くらいで止める (UI で警告)」が未実装

## 変更ファイル (これ以外は触らない)

- `src/app/admin/productions/_components/ProductionEditor.tsx`
  - `MetricsEditor` / `LinksEditor` を **クライアント側の安定 id を持つローカル state** に変更:
    - `useRef` のカウンタで採番した `{ id: number, data: CaseStudyMetric }[]` を `useState` で保持 (初期値は props から一度だけ生成)
    - add / remove / フィールド更新はすべてこの rows を更新し、`onChange(rows.map(r => r.data))` で親へ反映
    - `map` の `key` は index ではなく `r.id`
    - **永続スキーマ (production.ts) には id を足さない** — id はエディタ内 UI 都合のみ
  - metrics 上限:
    - `const METRICS_MAX = 4;`
    - `rows.length >= METRICS_MAX` のとき「+ 指標を追加」ボタンを `disabled` にし、その旨のヒント (`最大 4 件まで` 等) を表示
    - links には上限を設けない (ticket 対象は metrics のみ)

## 禁止事項

- `src/lib/schemas/production.ts` の変更 (metrics に `.max()` や id を足さない。既存データ互換のため上限は UI のみ)
- `data/productions.json` の変更
- ProductionDetail 側の表示ロジック変更 (本 PR は Editor に限定)
- yarn.lock / package.json の編集

## 実装ポイント

- `CaseStudyFields` が disable 時にアンマウントされる (caseStudy null 分岐) ため、`MetricsEditor` の初期化を props 由来の一度きり state にしても再有効化時に stale にならない
- 採番カウンタは `useRef(0)` でコンポーネント内ローカル (SSR/CSR で値が漏れないよう module scope に置かない)
- 上限到達時もすでに 4 件超で保存されていた既存データは表示・編集・保存できる (追加だけ止める)

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build
```

- admin/productions Editor で metrics を 3→4 件追加し 4 件目で追加ボタンが無効化されること
- metrics を途中削除しても他行の入力値がずれないこと (手動確認 or 挙動説明)
- caseStudy を無効化→再有効化しても metrics/links が空で復帰すること

## レビュー観点

### React 正当性
- [ ] key が index でなく安定 id
- [ ] controlled/uncontrolled 混在による warning が出ない
- [ ] 親 onChange が data 配列 (id 抜き) を渡している

### UX
- [ ] metrics 4 件で追加不可 + ヒント表示
- [ ] links は従来通り無制限

### 共通
- [ ] 禁止事項に違反していない (schema / data / ProductionDetail 不変更)
- [ ] yarn.lock 未変更
