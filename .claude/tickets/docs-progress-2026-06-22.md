# docs/progress-2026-06-22

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `docs/progress-2026-06-22`
- **base**: `develop`
- **PR title**: `docs(progress): #24-#28 反映 + Phase 1 完了 + Phase 2 計画`
- **依存**: PR #24/#25/#26/#28 が develop に merge 済
- **想定 reviewer 観点**: プロセス (PROGRESS.md SSOT)

## ゴール

PR #28 (CF Pages Phase 1) merge 完了を反映し、Phase 2 admin epic の計画を明文化する。
累計 22 → 27 PR merged。docs/PROGRESS.md のみ更新 (src/ は触らない)。

## 変更ファイル (これ以外は触らない)

- `docs/PROGRESS.md` — 完了 PR (#24/#25/#26/#28) 追加、進行中 PR セクションを「Phase 1 完了」反映、Phase 2 (2a/2b/2c/2d) を計画として文書化、Follow-up Issues から完了済 (LHCI / a11y nit / AdminForm DRY) を除去、累計 27 に更新
- `.claude/tickets/docs-progress-2026-06-22.md` (新規) — 本 PR の SSOT

## 禁止事項

- `src/**` — コード変更なし (docs のみ)
- 他 epic との file 競合 (Phase 2a barrel rework 等は別 PR で独立)

## 実装ポイント

### 反映する merged PR (4 件)

| # | タイトル | 配置先セクション |
|---|---|---|
| #24 | fix(ci): LHCI を yarn lhci に統一 | プロセス基盤 |
| #25 | a11y(skill): labelledby narrow + years 空時防御 + dark hairline 1.4.11 | Layer 2 |
| #26 | refactor(admin): useAutoDismissOnSuccess カスタムフックに DRY 化 | Layer 2 |
| #28 | perf(public): 公開ルートの force-dynamic 撤廃 + 静的 import 化 + OG image edge 化 (CF Pages Phase 1) | CF Pages Epic |

### CF Pages Epic 再構成

- Phase 1 (#28) を ✅ 完了に更新
- Phase 2 を以下 4 サブ epic に分解:
  - **2a `refactor/repo-barrel-split`**: `src/lib/repositories/index.ts` の static import を JSON/GitHub に分離 (driver 別 barrel)。admin/api/auth が edge に乗るための前提
  - **2b `perf/cf-edge-api-auth`**: `api/admin/*` (5) + `api/auth/[...nextauth]` (1) を `runtime='edge'` 化、検証
  - **2c `perf/cf-edge-admin-pages`**: `src/app/admin/**` の 8 ルート (layout + page x7: home/skill/profile/productions/productions/new/productions/[id]/login + admin top) を edge 化
  - **2d `chore/cf-pages-docs`**: `REPOSITORY_DRIVER=github` を CF Pages 本番で強制、`docs/CLOUDFLARE_PAGES_SETUP.md` 反映

### 現状の build:cf 残り (Phase 2 で edge 化する 14 ルート)

- admin pages: 8 (`/admin`, `/admin/home`, `/admin/skill`, `/admin/profile`, `/admin/productions`, `/admin/productions/new`, `/admin/productions/[id]`, `/admin/login`) ※ `layout.tsx` 含めると 9
- api/admin: 5 (`home`, `productions`, `profile`, `skills`, `productions/[id]` 等)
- api/auth: 1 (`[...nextauth]`)

### Follow-up Issues 整理

完了したため除去 (or 「完了済」サブセクションへ):
- LHCI バージョン不整合 → #24 で完了
- DanIndicator labelledby スコープ広すぎ問題 → #25 で完了
- AdminForm の 4 Editor 重複 useEffect → useAutoDismissOnSuccess → #26 で完了
- dark mode hairline-strong WCAG 1.4.11 → #25 で完了

残置 (中/低):
- OG image alt の Twitter Card 等への動的化余地
- caseStudy minor (key={i} → 安定 id、role 二重持ち hint、image なし時 CreativeWork フォールバック、Tategaki モバイル grid)
- Article rich result の image 必須 hint

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint
```

docs のみなので test/build は省略可。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "docs(progress): #24-#28 反映 + Phase 1 完了 + Phase 2 admin epic 計画"
git push -u origin docs/progress-2026-06-22
gh pr create --base develop --head docs/progress-2026-06-22 \
  --title "docs(progress): #24-#28 反映 + Phase 1 完了 + Phase 2 計画" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] PR 番号 (#24/#25/#26/#28) の説明が gh pr list と一致
- [ ] 累計 27 (= 22 + #24/#25/#26/#28 + #23 docs) ※ #23 は既存 SSOT 直近 docs (22 → 23?)。本 PR を含めると 27 PR
- [ ] Phase 2 (2a/2b/2c/2d) の依存順序が記載
- [ ] Follow-up Issues に完了項目が残っていない
- [ ] src/ を一切触っていない
