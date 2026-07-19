# feat/services-page — 受託メニューページ「お仕事のご依頼」新設

## 目的

クラウドソーシングの発注者が「何を・どのくらいの納期で頼めるか」を 1 ページで判断できるようにし、受注導線を作る。サイトの既存デザイン・配色・フォント・和風トーンを厳守し、新規セクションも既存の見た目に馴染ませること。

## 依存

なし

## 仕様

### データ (SSOT — ユーザーが後で文面を直せるよう一箇所管理)

- `data/services.json` を新設。構造の目安:
  ```json
  {
    "intro": "リード文 (1〜2 文)",
    "aiNote": "AI 駆動開発についての一文",
    "items": [
      { "kanji": "頁", "title": "LPコーディング", "description": "...", "turnaround": "3〜5日", "tags": ["HTML/CSS", "React"] }
    ],
    "turnaroundNote": "納期は目安です。規模・要件により変動します。",
    "contactCta": "まずはお気軽にご相談ください。"
  }
  ```
- `src/lib/schemas/services.ts` に Zod スキーマ (SSOT) を定義し、`src/lib/schemas/index.ts` の barrel に追加
- 読み込みは **edge 互換の static import + Zod parse** (`src/lib/i18n.ts` が `data/en/landing.json` を読むパターンを踏襲)。repositories driver / admin editor は今回スコープ外 (`node:fs` の static import 禁止)

### メニュー 5 件 (確定仕様 — 納期は必ず「規模により変動」の注記を全体に添える)

1. **LPコーディング** — 想定納期 3〜5日
2. **業務自動化ツール (GAS・Python)** — 想定納期 即日〜2日
3. **スクレイピング** — 想定納期 2〜4日 (対象サイトの利用規約・robots.txt を尊重する旨を description に一言入れる)
4. **Chrome拡張** — 想定納期 3〜7日
5. **既存コードの改修・バグ修正** — 想定納期 即日〜3日

### AI 駆動開発の一文 (aiNote)

趣旨: 「AI 駆動開発 (Claude Code) で高速に実装し、動作確認とセキュリティ検証は必ず人間が行っています」。この趣旨を保ったまま、サイトの静かで誠実な文体に合わせて整えてよい。**過剰な売り込み・煽り文句は禁止**。

### ページ

- `src/app/(use-header)/services/page.tsx` (Server Component):
  - `export const revalidate = 3600;`
  - `export const metadata`: title「お仕事のご依頼」/ description は受託内容が伝わる文面 / `alternates.canonical: '/services'`
- `src/app/(use-header)/services/_components/ServicesView.tsx`:
  - 見出しは `SectionHeader` (eyebrow は既存流儀の漢字一字 + 英語。例: 「依」 + 「COMMISSION · ご依頼」)
  - メニューは既存の `.card` + `TagList` で構成。納期は `.t-meta` 系の控えめな表示
  - 末尾に `/contact` への CTA (既存の `.btn-primary` or `WafuuButton` + `Rakkan` の流儀)
  - **新しい色・フォント・アニメーションを持ち込まない** (globals.css の既存トークン/クラスのみ)
- 参考雛形: `src/app/(use-header)/skill/page.tsx` + `_components/SkillView.tsx`

### 導線

- `src/app/_components/Header/index.tsx` の `NAV_ITEMS` に `/services` を追加 (既存項目の表記形式に合わせる。label は「依頼」等)
- `src/app/_components/NextStepCTA.tsx` の `resolveCTA()` に `/services` ページ用の分岐を追加。また production / skill ページの CTA 候補に services への導線を織り込む (既存の 2 導線構造を壊さない範囲で)

## 制約

- 依存パッケージの追加禁止
- コミットは変更単位で分割 (例: schema / data / page+View / 導線配線)。コミットメッセージは日本語 conventional commit
- `yarn lint && yarn test --passWithNoTests && yarn build` green を確認
- **デプロイ (main へのリリース) はしない**。PR は base develop
