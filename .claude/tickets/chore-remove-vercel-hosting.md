# chore-remove-vercel-hosting

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `chore/remove-vercel-hosting`
- **base**: `develop`
- **PR title**: `chore: Vercel ホスティングを廃止し Cloudflare Pages に一本化 (docs / CI の参照整理)`
- **依存**: PR #64 (CF デプロイを Actions に一本化) が develop に入っていること (済)
- **想定 reviewer 観点**: build:cf を壊していないか (vercel CLI は残す) / 参照の取りこぼし / scope 外変更

## 背景

オーナー判断で Vercel (旧本番) を廃止する。本番 `https://w3st.net` は既に Cloudflare Pages
(project `west-portfolio`, custom domain active, NS = Cloudflare) から配信されている。
Vercel プロジェクトの削除と GitHub の Vercel app 連携解除はオーナーが dashboard で行う。

## 重要: 残すもの

- `package.json` の devDependency **`vercel@47.0.4`** と `.github/dependabot.yml` の vercel ignore:
  `@cloudflare/next-on-pages` が内部で `vercel build` を使う (peer `vercel >=30 <=47.0.4`) ため **削除禁止**。
- `.vercel/output/static` (next-on-pages の出力 dir 名) を参照する `wrangler.toml` / `deploy.yml` / scripts / `.gitignore`。
- `.claude/tickets/*` (過去 PR の仕様記録) と `docs/archive/*` は履歴なので書き換えない。
- `.yarn/releases/*` は触らない。

## 変更ファイル (これ以外は触らない)

- `.github/workflows/deploy.yml`: コメントのみ (「test.yml の Vercel フォールバック」の記述を実態に)。ロジック変更なし
- `.github/workflows/test.yml` / `e2e.yml` / `lhci.yml`: `NEXT_PUBLIC_SITE_URL` の fallback
  `https://my-portfolio-kohl-one-59.vercel.app` → `https://w3st.net` (deploy.yml と統一)
- `CLAUDE.md`: 冒頭「Vercel (本番) + Cloudflare Pages (edge 検証)」→ 本番 = Cloudflare Pages (w3st.net, deploy.yml 経由)。
  「CF Pages / e2e / lhci の失敗は merge を阻まない」等の Vercel 関連記述を実態に。`vercel` devDep を残す理由を 1 行
- `README.md`: Vercel デプロイ記述を CF Pages に
- `docs/CLOUDFLARE_PAGES_SETUP.md` / `docs/PROGRESS.md` / `.claude/RESUME.md`: Vercel を本番/preview として扱う記述を廃止に更新
  (PROGRESS の過去 PR 履歴行は当時の事実なので書き換えない。現状説明・既知の問題欄のみ)
- `.claude/tickets/_TEMPLATE.md`: Vercel 前提の記述があれば CF Pages に
- `.claude/tickets/chore-remove-vercel-hosting.md` (本ファイル)

## 禁止事項

- `package.json` / `yarn.lock` / `wrangler.toml` / src の変更
- `vercel` devDep の削除

## 検証

```bash
export PATH="$HOME/.nodebrew/current/bin:$PATH"
yarn lint && yarn test
rm -rf .next && NEXT_PUBLIC_SITE_URL=https://w3st.net yarn build:cf   # vercel CLI が引き続き動くこと
git grep -n -i "vercel.app\|vercel (本番)" -- ':!.claude/tickets/*' ':!docs/archive/*' ':!yarn.lock' ':!.yarn/*'  # 残存なし
```

PR 本文の「オーナー作業」: Vercel プロジェクト削除 / GitHub → Settings → Integrations (Applications) で Vercel app のリポジトリアクセス解除 (PR の Vercel / Vercel Preview Comments check が消える)。
