# test-e2e-journal-feeds-fixture

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `test/e2e-journal-feeds-fixture`
- **base**: `develop`
- **PR title**: `test(e2e): journal card テストを専用 feeds fixture に分離 (#77 で data/feeds.json が空になり失敗)`
- **依存**: PR #77 (feeds リセット) が develop に入っていること (済)
- **想定 reviewer 観点**: 本番データと test fixture の分離 / e2e の安定性 / 本番挙動不変

## 背景

`tests/e2e/smoke.spec.ts` の `journal cards (fixture)` は `/journal` に zenn / qiita / github 各 1 件以上 (計 3 枚以上) の
`.card` を期待しているが、実体は **本番データ `data/feeds.json`** に依存していた。
PR #77 で誤データ (他人の Zenn 記事) を除去し `data/feeds.json` を空配列にしたため、
#77 以降の e2e が `smoke.spec.ts:70` で fail (run 39659657374 / 39660767461 / 39660862021)。
`data/feeds.json` は bot が毎日書き換える本番データなので、テストが依存すべきでない。

## ゴール

e2e は **専用 fixture** (zenn / qiita / github 各 1 件以上、本人 URL 形式のダミー) で journal を描画して card を検証する。
本番の `data/feeds.json` には一切依存しない。加えて空配列時に EmptyState が出ることも検証する (可能なら)。

## 進め方

1. `/journal` が feeds をどう読むか (`src/lib/feeds.ts` 等: static import / fs read / env) を確認。
2. 最小の差し替え手段を選ぶ。候補:
   - e2e workflow で build 前に `tests/e2e/fixtures/feeds.json` を `data/feeds.json` にコピー (CI 内のみ、commit しない)
   - feeds の読み込み元を env (例 `FEEDS_FILE`) で差し替え可能にし、e2e のみ fixture を指定
   本番ビルド (deploy.yml / preview.yml) の挙動を変えないこと。ローカルで `yarn playwright test` しても再現できる手段が望ましい。
3. fixture は Zod schema (`src/lib/schemas/`) に適合させる。

## 変更ファイル (最小限)

- `tests/e2e/fixtures/feeds.json` (新規)
- `.github/workflows/e2e.yml` and/or `playwright.config.*` and/or feeds 読み込み箇所 (選んだ手段に応じて最小限)
- `tests/e2e/smoke.spec.ts` (コメント更新、必要なら EmptyState ケース追加)
- `.claude/tickets/test-e2e-journal-feeds-fixture.md` (本ファイル)

## 禁止事項

- `data/feeds.json` に fixture を書き戻す (本番データに他人/ダミー記事を混ぜない)
- テストの期待値を緩めて通すだけの修正 (card 検証自体は残す)
- package.json / yarn.lock / wrangler.toml の変更

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
```
PR の CI で `e2e` が pass すること (ディスク空きが少ないのでローカル playwright は任意)。
