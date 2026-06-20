# ポートフォリオサイト改善 設計書

> 5人の専門家エージェント(UX / Perf・SEO / アーキテクト / A11y・i18n / コンテンツ戦略)による
> 提案 → 相互批評 → 統合の3フェーズ会議の成果物

---

## エグゼクティブサマリ

5専門家の提案を統合した結果、**最大の構造的負債は「admin が Cloudflare Pages 本番では `fs.writeFile` に阻まれて動かない」こと**であり、これを解かないと force-dynamic 撤廃 / ケーススタディ化 / フィード統合 / ブログ化など他の主要施策はすべて砂上の楼閣になる。

よって本ロードマップは **「永続化 → キャッシュ/型/境界の整流 → UX/コンテンツ拡張」** の3段階に厳密に切り、並列化を禁ずる。

- **Phase 1 (Quick Wins)**: AdSense 撤去・next/font 移行・画像最適化・SEO 配管・スキップリンクなど、依存が少なく即効性の高い基盤を一気に揃える
- **Phase 2 (Core)**: Repository 差し替え(GitHub commit ドライバ第一候補)・ISR 化・Zod SSOT 化・Server Actions 移行・Markdown SSR 化という本丸の構造改善
- **Phase 3 (Strategic)**: ケーススタディ/プロセスナラティブ統合・サブセット i18n (/en 単一ランディング)・コンテンツ資産化 (/articles、フィードの build-time 取り込み) を段階導入

四季メタファとフル i18n は「弱バージョン」に縮退または reject。

---

## 設計原則

1. **和の余白・静謐さを KPI と同等に扱う**: 情報を増やす提案は「何を引き算するか」をセットで決める
2. **基盤を直してから機能を積む**: admin 永続化 → キャッシュ/型 → UX/コンテンツ の順序を厳守し並列化しない
3. **Single Source of Truth**: Zod schemas を 型・バリデーション・admin・JSON-LD すべての出処に統一
4. **Server Component first**: Markdown と本文系は SSR を既定、`'use client'` は本当に必要な末端だけ
5. **計測なき改善はしない**: CWV・a11y・CV のいずれも Preview deploy 上で自動検証する CI ゲートに乗せる
6. **更新運用の負荷から逆算する**: 1記事あたり編集時間が増える施策は「最低限の必須項目」設計で守る

---

## Phase 1 — Quick Wins (数時間〜1日)

| # | タイトル | 工数 | 担当 |
|---|---------|------|------|
| 1 | AdSense 完全撤去とブランド整合性の回復 | S | コンテンツ戦略 |
| 2 | next/font 移行と Hina Mincho の preload (LCP/CLS 改善) | S | Perf/SEO |
| 3 | 画像最適化 (AVIF/WebP 化 + next/image 統一) | S | Perf/SEO |
| 4 | Metadata基盤・robots.ts・sitemap.ts・viewport の SEO 配管 | M | Perf/SEO |
| 5 | スキップリンク・ランドマーク・aria-current・タッチターゲット | S | A11y |
| 6 | コントラストトークン是正 (`--hai` → `--fg-muted` 4.5:1) | S | A11y |
| 7 | テーマフラッシュ解消 (Cookie + Server Component で SSR 確定) | S | アーキテクト |

### 1. AdSense 完全撤去
`layout.tsx` の AdSense Script、`public/ads.txt`、`google-adsense-account` meta を削除。`next.config.mjs` の `headers()` から adsense origin を除去。同時に **Plausible** (defer, 1KB) を `next/script strategy='afterInteractive'` で `(use-header)` レイアウト配下のみに導入。GA4 は併用しない (INP 悪化回避)。
- files: `src/app/layout.tsx`, `src/app/(use-header)/layout.tsx`, `public/ads.txt`, `next.config.mjs`

### 2. next/font 移行
Google Fonts の `<link>` 直書きを `next/font/google` に置換。Hina Mincho は `preload:true` + size-adjust 手調整、フォールバック先頭に Hiragino Mincho ProN / Yu Mincho。Noto Sans JP は self-host + unicode-range で漢字レンジ分割。`globals.css` の `--font-*` を next/font 変数に橋渡し。未使用 `GeistVF.woff` 削除。
- files: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/fonts/`

### 3. 画像最適化
`next.config.mjs` に `images.formats=['image/avif','image/webp']`、deviceSizes/imageSizes/minimumCacheTTL を追加。`scripts/optimize-images.mjs` (sharp) で red_wasi/red_origami/my_home/ment_cat を AVIF/WebP に変換し原本を 1600px 上限にリサイズ。`MaintenancePage.tsx` の Box img を next/image に置換。`Placeholders` の priority を props 化しヒーロー以外は `loading='lazy'`。`file.svg/globe.svg/window.svg` 削除。

### 4. Metadata 配管
`layout.tsx` に `metadataBase`、title template、共通 openGraph/twitter (card:'summary_large_image')、`robots(index,follow)`、`alternates.canonical`、`viewport(themeColor dark/light)`。各公開ページに `export const metadata`。`src/app/robots.ts` で `/admin`/`/api/admin` を Disallow、`src/app/sitemap.ts` で `productionRepo.list()` から URL 出力。各ページに一意な `<h1>` (visually-hidden 併用可)。

### 5. 最小 a11y 是正
`(use-header)/layout.tsx` に skip-link を Header の前に。Header の `<nav>` に aria-label、現在地リンクに `aria-current='page'`、テーマトグルに `aria-pressed` と sr-only ラベル。`<main id='main' tabIndex={-1}>`。Wagara/Rakkan の装飾 SVG に `aria-hidden='true' focusable='false'` を共通強制。`--touch-min:44px` を新設し `.btn/.tag/.theme-toggle` に min-height/min-width。`:focus-visible` を2層リング (背景内輪+朱外輪) に強化。

### 6. コントラストトークン是正
`--hai #8a8a8a` を `#6b6b6b` 相当に引き締め、本文補助色専用 `--fg-muted` を新設して `.t-meta` 等に割当。Dark 側 `#a8a4a0` 相当で 4.5:1 確保。朱の大型本文用も Dark 背景で 3:1 以上を実測再確認。

### 7. テーマフラッシュ解消
`layout.tsx` のインラインスクリプトをやめ、`cookies()` を Server Component で読んで `<html data-theme={cookie}>` を SSR 時点で確定。`ClientLayout` の `useEffect` 再同期を撤廃し、トグル時のみ Cookie を更新。`createAppTheme(mode)` の初期値もサーバから props で渡す。

---

## Phase 2 — Core (1〜2週)

| # | タイトル | 工数 | 担当 |
|---|---------|------|------|
| 1 | admin 永続化レイヤを fs から GitHub commit ドライバへ差し替え | L | アーキテクト |
| 2 | force-dynamic 撤廃 + unstable_cache + revalidateTag による ISR | M | アーキテクト |
| 3 | Zod スキーマを SSOT 化し型・バリデーション・admin フォームを統合 | M | アーキテクト |
| 4 | admin 編集を Server Actions + useActionState 化 | M | アーキテクト |
| 5 | JSON-LD (Person/CreativeWork) + 動的 OG 画像 + generateMetadata | M | Perf/SEO |

### 1. GitHub commit ドライバ ★最重要
`src/lib/repositories/index.ts` のファクトリを活かし、`GithubProductionRepo` / `GithubProfileRepo` / `GithubHomeRepo` / `GithubSkillsRepo` を Octokit で実装(`data/*.json` を Contents API で取得→更新→commit)。env `REPOSITORY_DRIVER=github|json` で分岐し、**本番は github**。fs 依存の `jsonFile.ts` は dev/test 限定。各 list/get は `{ data, sha, updatedAt }` を返す型に統一(ISR の dateModified と楽観ロックに直結)。GitHub PAT は Cloudflare Pages の env で管理。D1 ドライバは記事数が増えた段階で別途検討。

### 2. 正しい ISR
全公開ページから `export const dynamic = 'force-dynamic'` を撤去し `revalidate=3600` (Production は 60)。Repository の get/list を `unstable_cache` で包み `tags=['home']|['profile']|['skills']|['productions','production:'+id]`。admin の Server Action 成功時に `revalidateTag` を呼ぶ。`production/[id]/page.tsx` に `generateStaticParams`。**Markdown も Server Component 化** (rehype-sanitize + rehype-shiki/Server) し dynamic ssr:false を撤廃。`src/app/page.tsx` の redirect は `next.config.mjs` の `redirects()` で 308 化。

### 3. Zod SSOT
`src/lib/admin/schemas.ts` を `src/lib/schemas/` に昇格し、productionSchema/profileSchema/skillsSchema/homeSchema を SSOT に。url は `z.string().url().or(z.literal('')).optional()`、internal href は `z.string().regex(/^\//)`。`src/types/*` を `z.infer` に置換し手書き型を全削除。Repository の get/save は `parse()` を必ず通す。admin の `AdminForm` を react-hook-form + `@hookform/resolvers/zod` に載せ替え、field-level エラーを UI に自動反映。

### 4. Server Actions 化
`src/app/admin/_actions/` に `'use server'` な saveHome/saveProfile/saveSkills/upsertProduction/deleteProduction を実装。中身は `requireAdmin` → `headers()` で origin/sec-fetch-site 検証 → `zod.parse` → repo.save → revalidateTag。admin UI は `useActionState` で `{status,error,fieldErrors}` を受け取り赤線エラー自動表示。`useOptimistic` でプレビュー反映を即時化。`/api/admin/*` は外部連携用に温存。

### 5. JSON-LD + 動的 OG
`layout.tsx` に Person JSON-LD を埋め込み `sameAs` に profile.json の sns 配列を全列挙(Knowledge Graph 形成)。`production/[id]/page.tsx` に `generateMetadata({params})` を実装し title/description/og:image/published_time を動的反映。`app/production/[id]/opengraph-image.tsx` を `next/og` で実装(タイトル+role+stack+和柄)。CreativeWork/Article JSON-LD を `<script type='application/ld+json'>` で埋め込む。

---

## Phase 3 — Strategic (中長期)

| # | タイトル | 工数 | 担当 |
|---|---------|------|------|
| 1 | Production をケーススタディ化 (Process×STAR ハイブリッド) + DanIndicator a11y 刷新 | L | コンテンツ戦略 |
| 2 | Contact 導線常駐 + NextStepCTA + 内部リンク資産化 | M | UX |
| 3 | サブセット i18n (/en 単一ランディング1枚 + 主要ケーススタディ英訳3本) | L | A11y/i18n |
| 4 | コンテンツ資産化 (/articles + フィード build-time 取り込み + CI ガード) | L | コンテンツ戦略 |

### 1. ケーススタディ化
`PostPage` に `caseStudy: { role, period, teamSize, stack[], problem, approach, result, metrics[{label,value}], links[] }` を追加(Zod SSOT 経由)。表示は「**問・工・果**」の縦書き和テーマで、metrics は `<dl><dt>label</dt><dd>value</dd></dl>` セマンティクスで実装、明朝大字の縦中横で訴求。caseStudy 未入力記事は「ノート」バッジで種別を明示。並行して **DanIndicator を `role='meter'` aria-valuenow/valuetext 化**、空マスに「／」パターン記号追加(満マスは墨ベタ維持)、凡例はページ先頭に常時1回表示。

### 2. Contact 導線
Header 右側に Contact ボタン常駐(朱の落款付き)。`/contact` ルート新設し「採用オファー/協業相談/雑談」の3カード(mailto テンプレ + カジュアル面談カレンダー + SNS集約)。Footer 上部に `NextStepCTA` を追加し `usePathname()` で現在地別に2導線を出し分け。Production 詳細末尾に context 付きマイクロ CTA。Production 詳細に `RelatedPosts`(同一 tag) と Skill→Production の双方向リンク。**TagFilter を `?tag=` URL クエリ同期**にし、共有性とロングテール検索 CTR 獲得(live region でフィルタ件数通知)。Plausible の outbound/contact_click イベント計測を追加。

### 3. サブセット i18n
App Router の `[locale]` 全面導入は行わず、`/en` ルートに専用 Server Component ランディング1枚 + `/en/production/[id]` を主要3本に限定。データは `data/en/landing.json` と `data/en/case-studies.json` に関心分離し ja スキーマは拡張しない。`<html lang>` を /en 配下で en に切替、`metadata.alternates.languages` で hreflang ja/en/x-default。Tategaki は ja のみ、en では `horizontal-tb`。段位は 'San-dan (3/6, 4 years)' 英訳。Header に discreet な EN リンクのみ配置。フル多言語化は半年後の効果計測後に判断。

### 4. コンテンツ資産化
`/articles` を Production と同じ Repository パターンで追加し、自ドメインに技術記事を集約(Zenn は自サイトを canonical に向ける)。Now Writing/Now Building は Home 直下ではなく `/journal` 独立ページに切り出し、**GitHub Actions で日次に `data/feeds.json` を生成→commit→Pages 自動デプロイの build-time 取り込み**に倒す(ランタイム API 制限/CORS/SSR エラーを構造的に回避)。Lighthouse CI(Perf>=90, SEO>=95, A11y>=98)+ axe-core(jest-axe + @axe-core/playwright)+ Playwright E2E + `@next/bundle-analyzer`(初期 JS>200KB で fail)を PR ごとに preview deploy 上で実行。

---

## 却下された提案と理由

### 四季メタファによる全ページ視覚リズム差別化(UX 提案 2 のフル版)
Perf/SEO・a11y・グロース3者から concern。季節別 `--page-accent` でコントラスト検証が4倍×Dark mode で8倍に増え WCAG 1.4.3 を割るリスク、Wagara/フォント差分でバンドル肥大、OG 画像のブランド一貫性毀損、海外文脈での意味喪失、コンテンツ更新時の意思決定コスト増。**落款の色と罫線アクセントのみ `data-accent='aki'|'fuyu'` で切替える「弱バージョン」に縮退**し、Phase3 末で検討。

### EN 全面 i18n (`/[locale]` ルート全面導入 + data/*.json 二重化)
アーキテクトは reject、Perf/SEO・グロース・UX は concern。data の二重化は Zod SSOT 化・admin Editor 刷新・Repository 差し替えと工程衝突で三重改修。個人運用での英訳メンテは非現実的、薄い英語コンテンツは hreflang で「品質不均一」判定の逆 SEO。**Phase3 で「/en 単一ランディング + 主要3本英訳」のサブセットに縮退して採用**。

### Zenn/Qiita/GitHub フィードを Home ヒーロー直下に常駐表示
UX・Perf/SEO・アーキテクト3者から concern。Home の「3秒で世界観」を雑多な外部メタデータの羅列が破壊、GitHub Events API のレート制限 60req/h で Edge worker から発火すると即枯渇、Zenn RSS の CORS/403。**Phase3 で「/journal 独立ページ + GitHub Actions による build-time スナップショット」方式に変えて採用**、Home からはリンクのみ。

### AdSense を lazyOnload で延命する妥協案
コンテンツ戦略・UX・アーキテクト全員が完全撤去を強く支持。個人ポートフォリオでの AdSense は採用市場ブランドの致命的毀損で、収益はほぼゼロ、CSP/同意管理/admin 領域汚染の運用コストも残る。**Phase1 で完全撤去**(layout.tsx Script + ads.txt + meta verification すべて削除)、計測は Plausible 一本。

---

## 成功指標

- **Lighthouse**: Performance >=90、SEO >=95、Accessibility >=98 を `/home` `/production/[sample]` `/profile` で PR 毎に維持(lhci で CI ガード)
- **Core Web Vitals 実測**: LCP <=2.0s / INP <=200ms / CLS <=0.05 を90パーセンタイルで達成
- **a11y**: axe-core(jest-axe + @axe-core/playwright)で WCAG 2.2 AA violations=0、月次の VoiceOver/NVDA 実機検証で Skill の段位と Production 本文の意味伝達を確認
- **admin の本番動作**: Cloudflare Pages 上で Production 編集が成功し、編集 → revalidateTag → 公開ページ反映までが60秒以内、`data/*.json` の git 履歴に audit log が残る
- **CV 計測**: Production 詳細からの `contact_click` を Plausible で計測し、ローンチ後3か月でケーススタディ別 CV ランキングが取得可能 + 問い合わせ/スカウト返信が月1件以上発生

---

## 実装前に確認したい事項 (Open Questions)

1. **Repository ドライバの第一候補**: **GitHub commit**(個人運用・git 監査ログ・Pages 自動デプロイ連携)を推奨。D1(楽観ロック・将来の下書き/検索)に倒したい意向はあるか? 両者で Phase2 の実装内容と運用フロー(PAT 管理 / D1 バックアップ)が大きく変わる
2. **AdSense を完全撤去する判断に同意するか**? 収益はほぼゼロ・採用ブランド毀損・CWV 悪化のトレードオフが赤字との分析。残す場合は Phase1 の Plausible 導入時に CSP と CMP の追加工程が必要
3. **i18n は Phase3 で「/en 単一ランディング + 主要ケーススタディ3本のみ英訳」のサブセットから始める方針で良いか**? フル多言語化は半年後の効果計測後に再判断のフェーズ分けで合意したい
4. **Plausible は外部 SaaS (月額有料)**になるが採用するか? それとも self-host や Cloudflare Web Analytics (無料・機能限定) に倒すか? 採用方針で Phase1 の Script 配線と CSP 設定が分岐

---

## 付録: 会議参加者の所信表明

- **UX/プロダクトデザイナー**: 「3秒で世界観、30秒で人柄、3分で依頼したくなる」体験設計を最重視
- **パフォーマンス/SEO エンジニア**: 「検索とSNSで発見される導線」と「初回ペイントで離脱させない速度」の二本柱
- **フロントエンドアーキテクト**: 「admin 運用の本番化」と「Server Components/Server Actions/ISR への正しい寄せ直し」が攻めるべき二本柱
- **アクセシビリティ/i18n スペシャリスト**: WCAG 2.2 AA をミニマムラインに、海外採用担当者まで一切排除しない設計
- **コンテンツ/グロース戦略家**: 公開した瞬間が完成ではなく、検索流入・SNS シェア・リファラル経由で何度も戻ってきてもらうための再訪トリガー設計
