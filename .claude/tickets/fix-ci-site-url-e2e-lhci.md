# fix-ci-site-url-e2e-lhci

## メタ

- **branch**: `fix/ci-site-url-e2e-lhci`
- **base**: `develop`
- **PR title**: `fix(ci): e2e / lhci の build に NEXT_PUBLIC_SITE_URL を配線`
- **依存**: なし
- **想定 reviewer 観点**: CI / インフラ

## 背景

PR #19 で `jsonld.ts` の `resolveSiteUrl()` を production build で throw するよう必須化した際、`NEXT_PUBLIC_SITE_URL` の注入を `test.yml` の build step (L38) にしか配線しなかった。

結果:
- `test`(required)は env 注入済で green
- `e2e.yml`(`npx playwright test` → webServer `yarn build && yarn start`)は env 未注入 → prerender で `NEXT_PUBLIC_SITE_URL is required` により build 失敗 → e2e 常時 fail
- `lhci.yml`(`yarn build`)も同様に env 未注入 → build 失敗

これらは required check ではないため merge は阻まないが、恒常的な赤を解消する。

## 変更ファイル (これ以外は触らない)

- `.github/workflows/e2e.yml`
  - `Run Playwright tests` step に `env:` を追加し `test.yml` L38 と同じ式で `NEXT_PUBLIC_SITE_URL` を渡す
    (webServer の `yarn build` は親プロセス env を継承するため step env で伝播する)
- `.github/workflows/lhci.yml`
  - `Build` step に同じ `env:` を追加

いずれも値は `${{ vars.NEXT_PUBLIC_SITE_URL || 'https://my-portfolio-kohl-one-59.vercel.app' }}`(test.yml と一字一句同じ)。

## 禁止事項

- `test.yml` / `deploy.yml` / `feeds.yml` の変更
- アプリコード (`src/`) の変更
- `NEXT_PUBLIC_SITE_URL` のデフォルト値を test.yml と別物にすること(3 workflow で必ず統一)
- CF Pages / Vercel の deploy fail はスコープ外(別の既知問題)

## 実装ポイント

- e2e は build 単体 step がなく webServer 内 build のため、env は `Run Playwright tests` step に付ける
- lhci は独立した `Build` step があるのでそこに付ける
- 恒久的には repository variable `NEXT_PUBLIC_SITE_URL` を設定するのが本筋だが、本 PR は fallback 込みの式を配線してコード側で完結させる

## 検証

- YAML 構文が壊れていない (`env:` のインデントが step 直下)
- PR 上で e2e / lhci の build が `NEXT_PUBLIC_SITE_URL is required` で落ちなくなること(実 green は CI で確認)
- CF Pages / Vercel は引き続き赤でも可(required でない)

## レビュー観点

### CI/インフラ
- [ ] 3 workflow の `NEXT_PUBLIC_SITE_URL` 式が完全一致
- [ ] env の付与先 step が正しい (e2e=Playwright step / lhci=Build step)
- [ ] YAML インデント妥当

### 共通
- [ ] 変更は 2 ファイルのみ、src 不変更
- [ ] yarn.lock 未変更
