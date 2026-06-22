# docs/cf-pages-secrets-and-env

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `docs/cf-pages-secrets-and-env`
- **base**: `develop`
- **PR title**: `docs(cf): REPOSITORY_DRIVER=github 本番化 + CF secrets 手順 (Phase 2d-2)`
- **依存**:
  - Phase 2c (`aa97632`) — 全ルート edge runtime 化が develop に入っていること
  - Phase 2d-1 (`node:fs` ガード) — 同じ Phase 2d 内の別 PR と並行可
- **想定 reviewer 観点**: アーキテクト / デプロイ運用 / セキュリティ (secret 取り扱い)

## ゴール

Cloudflare Pages 本番動作のための env strategy を文書化し、`wrangler.toml` と `.env.example` を本番想定に合わせる。secret は dashboard 側で管理する運用に揃え、設定漏れ防止のための手順書を用意する。

## 変更ファイル (これ以外は触らない)

- `wrangler.toml` — `[vars]` セクションを追加し `REPOSITORY_DRIVER = "github"` を default 化。secret は `[vars]` に書かない旨をコメントで明記。
- `.env.example` — `REPOSITORY_DRIVER` の値説明を強化 (dev/test では `json`、本番では `github` 必須)。`GITHUB_TOKEN/OWNER/REPO/BRANCH` の説明を強化。
- `docs/CLOUDFLARE_PAGES_SETUP.md` — Phase 2 完了状態を反映、CF dashboard で設定する env を Plain text / Encrypt secret に分類して列挙、設定後の確認手順、Phase 2 完了で PR preview が green になる旨を追記。
- `.claude/tickets/docs-cf-pages-secrets-and-env.md` (新規) — 本仕様 (SSOT)。

## 禁止事項

- `src/` 配下 — 本 PR は env / docs のみ。コード変更は別 PR (Phase 2d-1 ほか)。
- 他 docs (`docs/PROGRESS.md` 等) の整合チェック — Phase 2d-progress PR に任せる。
- `yarn.lock` — env / docs 変更で依存は増えない。
- `wrangler.toml` の `[vars]` に secret を書く — 漏洩リスク。**dashboard 側に Encrypt で登録**。

## 実装ポイント

### `wrangler.toml`

```toml
# 既存に維持
name = "west-portfolio"
compatibility_date = "2025-01-20"
compatibility_flags = [ "nodejs_compat" ]
pages_build_output_dir = ".vercel/output/static"

# 新規: production default
[vars]
REPOSITORY_DRIVER = "github"
```

`GITHUB_TOKEN` 等は `[vars]` には書かず、Cloudflare dashboard の Environment variables (Encrypt) のみで管理する旨をコメントで明記する。

### `.env.example`

- `REPOSITORY_DRIVER` の説明を「dev/test では `json` (default)、本番 (CF Pages) では `github` 必須」に書き換え。
- `GITHUB_TOKEN` は fine-grained PAT 推奨 + `Contents: Read and write` 権限が必要、と明記。
- `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` の意味を追記。

### `docs/CLOUDFLARE_PAGES_SETUP.md`

- 冒頭の「動作しません」を「Phase 2 完了で **動作する**」に書き換え。
- CF dashboard に設定すべき env を Plain text / Encrypt に分類して表で列挙。
- secret を `wrangler.toml` に書かない理由を明記。
- 設定後の確認手順 (deployment の Functions タブで edge function を確認 / admin 編集 → GitHub commit を確認) を追加。
- Phase 2 完了で PR preview deployment が初めて green になる旨を追加。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint
```

(本 PR は env / docs のみ。`yarn test` / `yarn build` は無関係なので必須ではないが、lint のみは念のため通す。)

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "docs(cf): REPOSITORY_DRIVER=github 本番化 + CF dashboard secrets 手順 (Phase 2d-2)"
git push -u origin docs/cf-pages-secrets-and-env
gh pr create --base develop --head docs/cf-pages-secrets-and-env \
  --title "docs(cf): REPOSITORY_DRIVER=github 本番化 + CF secrets 手順 (Phase 2d-2)" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] `wrangler.toml` に secret が書かれていないこと
- [ ] `.env.example` の `REPOSITORY_DRIVER=json` がローカル default のまま (本番との差分は docs で説明)
- [ ] `docs/CLOUDFLARE_PAGES_SETUP.md` に Plain text / Encrypt secret の分類が明記されていること
- [ ] Phase 2 完了状態が反映されていること (古い「動作しません」表記が残っていないか)
- [ ] `src/` を触っていないこと
