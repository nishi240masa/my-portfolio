# feat/seo-commission-meta — メタ情報を「受託開発を請け負う情報系学生」向けに最適化 + OGP 画像

## 目的

検索・SNS シェアで「受託開発を請け負う情報系学生」として伝わる title / description / OGP を整備する。現在 root layout が参照する `/og-default.png` は実ファイルが存在せず 404 (シェア時の画像が壊れている) — これを解消する。

## 依存

なし

## 仕様

### 1. root metadata (`src/app/layout.tsx`)

- `title.default` / `title.template` を見直し。要件: 「西尾匡生 (west)」の名前 + 受託開発を請け負っていることが伝わる語 (例: 「Web開発・業務自動化の受託」) を含む。詩的キャッチのみの現状から、検索結果で内容が判断できる形へ
- `description` (~120 字目安): 受託メニューの内容 (LP コーディング / 業務自動化 GAS・Python / スクレイピング / Chrome 拡張 / 改修・バグ修正) と、Go/TypeScript を軸にした情報系学生エンジニアであることが伝わる文面。誠実なトーンで、煽り文句・実績の誇張は禁止
- キーワード詰め込み (keyword stuffing) はしない

### 2. OGP 画像 — root `opengraph-image.tsx` の新設

- `src/app/opengraph-image.tsx` を next/og (ImageResponse) で新設。既存の `src/app/(use-header)/production/(use-production)/[id]/opengraph-image.tsx` のパターン (edge / force-static / alt export) を踏襲
- デザインはサイトの和風トーンに合わせる: 和紙色背景 + 墨色テキスト + 朱の落款風の「西」+ 名前 + 受託が伝わる一言。既存 OG 実装が使う色値を流用し、新しい配色を発明しない
- `layout.tsx` の `openGraph.images` / `twitter.images` から存在しない `/og-default.png` への参照を撤去 (file convention の opengraph-image が自動で og:image / twitter:image に配線されることを確認)

### 3. Twitter Card

- `twitter.card: 'summary_large_image'` を設定 (未設定なら)。site/creator に `@westM27`

### 4. 主要ページの description 調整 (軽微)

- `/production`: 「受託のご依頼の参考になる制作事例」という文脈を一言足す
- `/profile` / `/skill`: 現行文面を尊重しつつ、発注者が読んでも成立する表現に微調整
- **`/contact` と `/services` のページ metadata は別チケット管轄のため触らない** (conflict 回避)

### 検証

- `yarn build` 後、メタ出力を確認 (`curl localhost` か build 出力の HTML) — og:image が生成 route を指すこと
- 既存の JSON-LD (`src/lib/jsonld.ts`) が壊れていないこと

## 制約

- 依存パッケージの追加禁止 (next/og は Next.js 同梱)
- コミットは変更単位で分割 (例: root metadata / OG 画像 / ページ別 description)。日本語 conventional commit
- `yarn lint && yarn test --passWithNoTests && yarn build` green
- **デプロイ (main へのリリース) はしない**。PR は base develop
