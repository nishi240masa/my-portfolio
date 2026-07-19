# docs-progress-line20-and-vercel-known-issue

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `docs/progress-line20-and-vercel-known-issue`
- **base**: `develop`
- **PR title**: `docs(progress): CF Pages 注記の整合 + Vercel known issue 追記`
- **依存**: PR #35 (Phase 2d-3) が develop に merged 済 (本 PR は #35 reviewer の minor 指摘に対する後追い)
- **想定 reviewer 観点**: プロセス / docs SSOT

## ゴール

PR #35 reviewer の minor 指摘 (PROGRESS.md line 20 の CF Pages CI 注記が Phase 2 完了後の現状と矛盾) を解消し、Vercel preview deploy が PR #28 (2026-06-20) 以降 systematically 失敗している事実を「既知の問題 (Known Issues)」セクションとして記録する。

## 変更ファイル (これ以外は触らない)

- `docs/PROGRESS.md`
  - line 20 周辺の「Cloudflare Pages CI: admin が node:fs を使う関係で全ルートが runtime='nodejs' になり ... PR preview は常に失敗」を Phase 2 完了後の現状に整合する文言へ書き換え。
  - 新規セクション「既知の問題 (Known Issues)」を追加し、Vercel preview deploy systematic failure を記録。
- `.claude/tickets/docs-progress-line20-and-vercel-known-issue.md` (新規) — 本 SSOT

## 禁止事項

- `src/` — 本 PR は docs only
- `docs/CLOUDFLARE_PAGES_SETUP.md` 等の他 docs — 別 PR スコープ (#33 で対応済)
- `yarn.lock` — 依存変更なし

## 実装ポイント

### PROGRESS.md line 20 書き換え

旧:
```
- **Cloudflare Pages CI**: admin が `node:fs` を使う関係で全ルートが `runtime='nodejs'` になり next-on-pages の Edge 要件と非互換。PR preview は **常に失敗するが merge ブロックしない**ので無視可。根本対処は follow-up
```

新:
```
- **Cloudflare Pages CI** (旧: 常に失敗): Phase 2 (PR #28-#34) で全 dynamic route を edge runtime 化し、edge required list が空になったため **CF dashboard で secrets を設定すれば本番で PR preview が通る想定**。実 green 化は CF dashboard 側の設定後に確認。設定手順は [docs/CLOUDFLARE_PAGES_SETUP.md](./CLOUDFLARE_PAGES_SETUP.md)
```

### 「既知の問題」セクション追加 (Follow-up Issues の前に挿入)

- Vercel preview deploy が PR #28 (2026-06-20) 以降 systematically 失敗
  - コード自体は `yarn build` ローカル green、Vercel deploy のみ fail
  - 詳細ログ取得には `npx vercel inspect dpl_<id> --logs` 必要 (オーナー作業)
- 仮説候補:
  - `NEXT_PUBLIC_SITE_URL` 等の env が Vercel 側に未設定
  - opengraph-image edge runtime と Vercel build target の互換性
  - barrel 物理分割 (Phase 2a) 後のモジュール解決
- `test` job (GitHub Actions) と `build:cf` は green なので merge は問題なし

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint
```

docs only のため `yarn test` / `yarn build` は不要 (lint は markdown 周りの整合確認用)。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "docs(progress): CF Pages 注記を Phase 2 後の現状に整合 + Vercel known issue 追記"
git push -u origin docs/progress-line20-and-vercel-known-issue
gh pr create --base develop --head docs/progress-line20-and-vercel-known-issue \
  --title "docs(progress): CF Pages 注記の整合 + Vercel known issue 追記" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] 仕様通りに実装されているか (PROGRESS.md line 20 周辺 + Known Issues セクション)
- [ ] 禁止事項に違反していないか (src/ / 他 docs / yarn.lock 変更なし)
- [ ] Known Issues の記述が事実ベース (推測は「仮説候補」と明示)
- [ ] CLOUDFLARE_PAGES_SETUP.md への相対リンクが壊れていない
