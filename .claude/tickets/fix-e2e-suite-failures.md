# fix-e2e-suite-failures

## メタ

- **branch**: (調査 → 3 系統に分割予定。まず調査、PR は系統ごと)
- **base**: `develop`
- **依存**: `fix/ci-site-url-e2e-lhci` (#42) merge 後 (build が通らないと e2e 本体が走らない)
- **想定 reviewer 観点**: A11y / テスト / コンテンツ

## 背景

#42 で e2e の build blocker (`NEXT_PUBLIC_SITE_URL` 未注入) を解消した結果、
これまで build エラーの陰で一度も実行されていなかった e2e テスト本体が走り、
**潜在していた 3 系統の失敗**が顕在化した (run 29687331342)。
いずれも #41 / #42 とは無関係で、develop 単体でも再現する既存不整合。

## 顕在化した失敗 (3 系統)

### 系統1: smoke heading の期待値が陳腐化 (テスト側)
- `tests/e2e/smoke.spec.ts:27` の見出し assertion がコピー変更に追随できていない
- `/profile`: 実 h1 = `"人物像。 つくることで、世界の解像度を上げたい。 次の一手"` / 期待 = `/プロフィール|profile|PROFILE|西尾/i` → 不一致
- `/skill`: 同様に不一致 (実見出しを要確認)
- **性質**: 製品は正しく描画されている。テストの期待正規表現が古い。→ **テスト修正** (期待値を実 h1 に合わせる or 見出し検出セレクタを見直す)

### 系統2: btn-primary の color-contrast 違反 (実 a11y バグ / serious)
- axe `color-contrast` (impact: serious) が `/home` ほか複数ページで発生
- 該当要素: `a.btn-primary[aria-label="Production · 作品を見る"]` とその子 `.t-eyebrow` / `span`
- **性質**: 全ページ共通の primary ボタンの実コントラスト不足。→ **globals.css の `.btn-primary` / `.t-eyebrow` の前景/背景コントラストを WCAG AA (4.5:1) に是正**
- 影響ページ: /home /production /profile /skill /articles /journal (btn-primary を含む全ページ)

### 系統3: 外部画像 404 (データ/コンテンツ)
- `[WebServer] ⨯ upstream image response failed for https://production.w3st.net/image/sensor-game.png 404`
- production データが参照する外部画像が dead
- **性質**: `data/productions.json` (または github driver 側データ) の画像 URL が 404。→ **画像 URL 差し替え or プレースホルダ fallback**。next/image の外部 404 が /production の描画・axe に波及している可能性も要確認

## 進め方 (推奨: 系統ごとに別 PR)

1. **系統1 (テスト修正)** — 最も安全。`smoke.spec.ts` の期待見出しを現行コピーに整合。低リスクで e2e の heading 系を green 化
2. **系統2 (a11y)** — `.btn-primary` コントラスト是正。`docs/` の A11y 方針 (--fg-muted 等) と整合。DanIndicator #25 と同様の WCAG 1.4.x 対応
3. **系統3 (データ)** — 404 画像の実体確認 → 差し替え or fallback。オーナー確認が要る可能性 (正しい画像 URL)

## 検証

各 PR 後、PR CI の e2e を確認 (#42 merge 後は build を通過して実テストが走る)。
ローカル再現:
```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"; unset NODE_OPTIONS
export NEXT_PUBLIC_SITE_URL="https://example.com"
npx playwright test tests/e2e/smoke.spec.ts
```

## 禁止事項

- 系統をまたいで 1 PR に混ぜない (原因が別々でレビュー観点も違う)
- e2e を required 化しない (現状 non-required の運用は維持)

## メモ

- e2e / lhci は PR 時のみ実行 (develop push では走らない) ため、develop 直の履歴には赤が残らない
- 系統2 は実ユーザ影響のある a11y 欠陥なので優先度中〜高
