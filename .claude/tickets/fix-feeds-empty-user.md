# fix-feeds-empty-user

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `fix/feeds-empty-user`
- **base**: `develop`
- **PR title**: `fix(feeds): ユーザー名未設定時に他人の Zenn トレンド記事を取り込む問題を修正`
- **依存**: なし
- **想定 reviewer 観点**: 未設定時の安全側挙動 / 既存表示の破壊なし / テスト

## 背景 (2026-10-22 調査)

Journal ページの Zenn 欄にオーナー以外の記事が 20 件表示されている。

- `ZENN_USER` / `QIITA_USER` / `GITHUB_USER` / `USER_HANDLE` は GitHub の vars / secrets に **未登録**。
- `feeds.yml` の `${{ vars.X || secrets.X }}` は未登録時 **空文字** を env に渡す。
- `scripts/fetch-feeds.mjs` は `process.env.ZENN_USER ?? USER_FALLBACK` のため空文字では fallback されず user = `''`。
- `https://zenn.dev//feed` は **Zenn のトレンドフィード** を 200 で返す → 他人の記事が `data/feeds.json` に入る。
  (Qiita / GitHub は `users//...` で 404 → ほぼ空)
- fallback の `'w3st'` も Zenn では 404 で、実在しないハンドル。
- オーナーは後でユーザー名を GitHub **Secrets** に登録する予定 (workflow は `vars || secrets` を参照済みなので workflow 変更は不要)。

## ゴール

ユーザー名が未設定 / 空のサービスは **取得をスキップして空配列** にし、他人のコンテンツを絶対に取り込まない。
Secrets 登録後は自動で本人の記事が入る。

## 変更ファイル (これ以外は触らない)

- `scripts/fetch-feeds.mjs`
  - `??` → 空文字も未設定扱い (`trim()` 後に空なら未設定)。
  - 実在しない固定 fallback `'w3st'` を廃止 (USER_HANDLE が明示された場合のみ fallback)。
  - 未設定サービスは fetch せず `[]`、ログに `skip zenn: ZENN_USER not set` 等を出す。
  - 取得結果の安全網: Zenn の各 item の URL が `https://zenn.dev/<user>/` で始まらないものは除外 (トレンド等の混入防止)。
    Qiita / GitHub も API の owner / user が一致しないものは除外。
  - ユーザー名を URL に入れる箇所は `encodeURIComponent`。
- テスト (既存の jest 構成に合わせる。`scripts/` が jest 対象外なら、ロジックを小さな純関数に切り出してテスト可能にするか、最小限の node スクリプトテストを追加):
  未設定 / 空文字 / 空白のみ → skip、他ユーザーの URL 混入 → 除外、正常系。
- `data/feeds.json`: 現在の誤データ (他人の Zenn 記事) を空配列にリセット (zenn / qiita / github)。
  ※ main 側でも bot が毎日書き換えるため、main 反映までは main の誤データは残る旨を PR 本文に記載
- Journal 側の表示: 配列が空のときに崩れず「記事はまだありません」等で自然に表示されることを **確認のみ** (崩れる場合のみ最小修正可)
- `.claude/tickets/fix-feeds-empty-user.md` (本ファイル)

## 禁止事項

- `.github/workflows/feeds.yml` の変更 (vars || secrets 参照は維持)
- package.json / yarn.lock / wrangler.toml の変更
- 他人の記事を取り込みうる fallback (トレンド / 全体フィード) の追加

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
ZENN_USER= QIITA_USER= GITHUB_USER= node scripts/fetch-feeds.mjs   # 全 skip、feeds.json は空配列 (実行後 git diff で確認し、検証用の変更は戻す)
```

PR 本文に「オーナー作業: GitHub Secrets に ZENN_USER / QIITA_USER / GITHUB_USER を登録 → Actions の Refresh external feeds を手動実行 (workflow_dispatch)。main 反映後に有効」と記載。
