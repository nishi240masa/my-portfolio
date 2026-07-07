# プロジェクトサーベイレポート

**作成日**: 2026-02-07
**プロジェクト**: my-portfolio (west-portfolio)

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [プロジェクト構造](#プロジェクト構造)
3. [技術スタック](#技術スタック)
4. [ページ構成とルーティング](#ページ構成とルーティング)
5. [コンポーネント構成](#コンポーネント構成)
6. [スタイリング実装](#スタイリング実装)
7. [データ管理](#データ管理)
8. [設定ファイル](#設定ファイル)
9. [コード品質](#コード品質)
10. [実装状況](#実装状況)
11. [Cloudflare Pages統合](#cloudflare-pages統合)
12. [改善提案](#改善提案)

---

## プロジェクト概要

**プロジェクト名**: west-portfolio
**種類**: 個人ポートフォリオサイト
**デザインテーマ**: 和風デザイン（深紅、桜色、和紙調）

### 統計情報

- **総ファイル数**: 30個
- **TypeScript/TSX ファイル**: 25個
- **総行数**: 833行
- **ソースコードサイズ**: 280KB

---

## プロジェクト構造

### ディレクトリ構成

```
/Users/k23087kk/src/my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (use-header)/       # ヘッダー付きレイアウトグループ
│   │   │   ├── home/
│   │   │   ├── production/
│   │   │   │   └── (use-profuction)/
│   │   │   │       └── [id]/   # 動的ルート
│   │   │   ├── profyle/
│   │   │   └── skill/
│   │   ├── _components/        # グローバルコンポーネント
│   │   ├── fonts/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── theme.ts
│   │   └── globals.css
│   ├── store/                  # Jotai状態管理
│   │   └── postAtom.ts
│   ├── types/                  # TypeScript型定義
│   │   └── post.ts
│   └── utils/                  # ユーティリティ関数
│       └── article.ts
├── public/                     # 静的アセット
├── .next/                      # Next.js build output
├── out/                        # 静的エクスポート
├── package.json
├── tsconfig.json
├── next.config.mjs
├── wrangler.toml
├── .eslintrc.json
└── .prettierrc
```

---

## 技術スタック

### 主要フレームワーク・ライブラリ

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| **フレームワーク** | Next.js | ^15.1.3 | App Router、SSR/SSG |
| **React** | React | ^19.0.0 | UI フレームワーク |
| **言語** | TypeScript | ^5.7.2 | 型安全開発 |
| **UI Framework** | Material-UI | ^6.2.0 | コンポーネントライブラリ |
| **スタイリング** | Emotion | ^11.14.0 | CSS-in-JS |
| **状態管理** | Jotai | ^2.0.0 | 原始的な状態管理 |
| **Markdown** | react-markdown | ^9.0.1 | Markdown レンダリング |
| **数学表記** | KaTeX | ^7.0.1 | 数式対応 |
| **アニメーション** | Framer Motion | ^11.0.0 | アニメーション |
| **デプロイ** | Wrangler | ^3.103.2 | Cloudflare Pages CLI |

### 開発ツール

- **ESLint**: ^9.18.0 (airbnb-typescript設定)
- **Prettier**: ^3.0.0 (コードフォーマッター)
- **Cloudflare Next.js Integration**: @cloudflare/next-on-pages ^1.13.7

---

## ページ構成とルーティング

### ページ一覧

| パス | ファイル | Runtime | 説明 | 状態 |
|------|---------|---------|------|------|
| `/` | `src/app/page.tsx` | edge | トップページ（/homeへリダイレクト） | ✅ 完成 |
| `/home` | `src/app/(use-header)/home/page.tsx` | edge | ホームページ | ✅ 完成 |
| `/production` | `src/app/(use-header)/production/page.tsx` | edge | プロダクション一覧 | ✅ 完成 |
| `/production/[id]` | `src/app/(use-header)/production/(use-profuction)/[id]/page.tsx` | edge | プロダクション詳細 | ✅ 完成 |
| `/profyle` | `src/app/(use-header)/profyle/page.tsx` | edge | プロフィール | ⚠️ メンテナンス中 |
| `/skill` | `src/app/(use-header)/skill/page.tsx` | edge | スキル | ⚠️ メンテナンス中 |

### ルーティング機能

- **グループルーティング**: `(use-header)` グループで統一的にヘッダーを表示
- **動的ルート**: `/production/[id]` で個別記事ページへのパラメータ化ルート
- **Edge Runtime**: すべてのページで `export const runtime = 'edge'` を指定（Cloudflare対応）

---

## コンポーネント構成

### コンポーネント階層

```
RootLayout (layout.tsx)
├── ThemeProvider (MUI theme)
└── {children}
    ├── / (TopPage)
    │   └── Home (redirect to /home)
    │
    └── (use-header) Group
        ├── Layout
        │   ├── Header (ナビゲーション)
        │   └── {children}
        │
        ├── /home
        │   └── HomePage
        │       ├── Paper (画像)
        │       └── Typography (縦書きテキスト)
        │
        ├── /production
        │   └── ProductionPage
        │       ├── Typography (タイトル)
        │       └── ProductionPageLogic (Jotai)
        │           └── Grid2 (カード一覧)
        │               └── CardPage × N
        │
        ├── /production/[id]
        │   └── ArticlePage
        │       ├── Typography (タイトル)
        │       ├── Box (メタ情報)
        │       ├── CardMedia (画像)
        │       ├── ReactMarkdown (本文)
        │       └── Button (戻るボタン)
        │
        ├── /profyle
        │   └── MaintenancePage
        │
        └── /skill
            └── MaintenancePage
```

### 主要コンポーネント

| コンポーネント | 行数 | 用途 | 状態 |
|-------------|------|------|------|
| `Header` | 46 | ナビゲーションバー | ✅ 完成 |
| `CardPage` | 96 | プロダクションカード | ✅ 完成 |
| `ArticlePage` | 147 | 記事詳細表示（Markdown対応） | ✅ 完成 |
| `HomePage` | 94 | ホームページビュー | ✅ 完成 |
| `ProductionPageLogic` | 31 | プロダクション一覧ロジック | ✅ 完成 |
| `MaintenancePage` | 43 | メンテナンス画面 | ✅ 完成 |
| `WafuuButton` | 18 | 和風スタイルボタン | 🔧 サンプル |
| `WagaraBox` | 20 | 和柄背景ボックス | ⚠️ 未実装 |

---

## スタイリング実装

### スタイリング戦略

1. **Material-UI Theme ベース**
   - `src/app/theme.ts` で全体的なテーマを定義
   - 日本風の色彩設計

2. **MUI sx prop 使用**
   - 39箇所で `sx={}` プロップを使用してインラインスタイリング

3. **Emotion (CSS-in-JS)**
   - `@emotion/react` と `@emotion/styled` を使用

4. **グローバル CSS**
   - `src/app/globals.css` は空（すべてMUIとEmotionで管理）

### テーマ設定

```typescript
palette: {
  primary: '#b5495b',         // 深紅色
  secondary: '#e9c895',       // 桜色
  background: {
    default: '#f7f4ef',       // 和紙風
    paper: '#fffaf4',         // 明るい和紙風
  },
  text: {
    primary: '#2c2c2c',       // 墨色
    secondary: '#8a8a8a',     // 灰色
  }
}

typography: {
  fontFamily: "Hina Mincho", "Noto Sans JP"
}
```

---

## データ管理

### 状態管理アーキテクチャ

**Jotai による状態管理**:
- `src/store/postAtom.ts`: ポストデータの中央管理
- `atom` と `loadable` を使用した非同期データハンドリング

### データフロー

```
postAtom.ts (ハードコードデータ)
    ↓
postAtomLoadable (Jotai loadable)
    ↓
useAtom hook (ProductionPageLogic, ArticlePage)
    ↓
コンポーネント表示
```

### 現在のデータソース

- **ハードコードデータ**: `postAtom.ts` に5個のプロダクション記事
- **外部API呼び出しなし**: すべてクライアントサイド

### データ型定義

```typescript
interface Post {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  tags: string[];
}

interface PostPage {
  id: number;
  title: string;
  image: string;
  peopleNum: number;
  role: string;
  period: string;
  technologys: string[];
  description: string;
  date: string;
  tags: string[];
  content: string;
}
```

### プロダクションデータサンプル

1. **MD2S** - 記事投稿・スライド変換サイト
   - 技術: Golang, GORM, Gin, Docker, PostgreSQL
   - チーム: 4人, 期間: 1週間

2. **w3st CMS** - ヘッドレスCMS
   - 技術: Golang, PostgreSQL, Docker, AWS, DDD
   - 個人開発, 期間: 5ヶ月

3. **センサー連動型対戦ゲーム** - IoT + リアルタイム通信
   - 技術: Golang, WebSocket, Next.js, Raspberry Pi
   - チーム: 3人, 期間: 1ヶ月

---

## 設定ファイル

### package.json スクリプト

```json
{
  "dev": "next dev",                                    // 開発サーバー
  "build": "next build",                                // Vercel向けビルド
  "start": "next start",                                // プロダクションサーバー
  "build:cf": "next build && npx @cloudflare/next-on-pages",  // Cloudflare向けビルド
  "preview": "wrangler pages dev .vercel/output/static",      // ローカルプレビュー
  "fmt": "prettier --write ./src/",                     // フォーマット
  "lint": "eslint --ext .ts,.tsx ./src"                 // リント
}
```

### next.config.mjs

```javascript
{
  reactStrictMode: true,        // 厳格モード
  swcMinify: true,              // SWCミニファイア（高速）
  output: 'standalone',         // スタンドアロンビルド
  experimental: {
    appDir: true,               // App Router有効
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,             // 厳密な型チェック
    "paths": {
      "@/*": ["./src/*"]        // パスエイリアス
    },
    "target": "ES2017"
  }
}
```

### wrangler.toml (Cloudflare Pages)

```toml
compatibility_date = "2025-01-20"
node_compat = true

[build]
command = "yarn build:cf"
[build.environment]
NODE_VERSION = "18"

[pages]
pages_build_output_dir = "out"
```

---

## コード品質

### 良い点

✅ **型安全性**
- TypeScript strict mode 有効
- すべてのコンポーネントで型定義
- 定義された Post/PostPage インターフェース

✅ **コード構成**
- 適切なディレクトリ構成（logic/view 分離）
- Jotai による単一責任の原則
- コンポーネント分割が適切（再利用可能）

✅ **スタイリング一貫性**
- MUI Theme ベースの統一的なスタイル
- 日本風カラーテーマの統一

✅ **リンティング**
- ESLint + Prettier で統一されたスタイル
- Airbnb ルール + TypeScript チェック

✅ **コンポーネント可読性**
- 平均ファイルサイズ: 33行（保守しやすい）

### 改善の余地

⚠️ **エラーハンドリング**
- 単純な `<div>エラーが発生しました</div>` 表示のみ
- ErrorBoundary なし

⚠️ **ローディング表示**
- スピナーやスケルトン UI なし

⚠️ **アクセシビリティ**
- alt 属性やaria ラベル少ない

⚠️ **テスト**
- テストファイルが存在しない

⚠️ **ユーティリティ関数**
- `article.ts` に useAtom フックを使用（サーバーコンポーネントで実行不可）

---

## 実装状況

### 完成したページ

| ページ | 実装度 | コメント |
|--------|--------|----------|
| Home | 100% | 画像とテキスト表示、デザイン完成 |
| Production List | 100% | Jotai で5個の記事をカード表示 |
| Production Detail | 100% | Markdown対応、KaTeX数式対応 |
| Header | 100% | ナビゲーション機能完成 |
| Maintenance | 100% | メンテナンス画面テンプレート |

### 未実装/メンテナンス中

| ページ | 状態 | コメント |
|--------|------|----------|
| Profyle (プロフィール) | ⚠️ メンテナンス中 | MaintenancePage 表示 |
| Skill (スキル) | ⚠️ メンテナンス中 | MaintenancePage 表示 |
| WagaraBox | ⚠️ 未完成 | URL placeholder が不正 |

---

## Cloudflare Pages統合

### 統合の詳細

1. **Edge Runtime**
   - すべてのページで `export const runtime = 'edge'` 指定
   - Cloudflare Workers 互換コードで動作

2. **ビルドプロセス**
   ```bash
   yarn build:cf
   → next build && npx @cloudflare/next-on-pages
   ```

3. **@cloudflare/next-on-pages**
   - Next.js を Cloudflare Workers で実行可能な形に変換
   - バージョン: ^1.13.7

4. **デプロイフロー**
   - ローカル: `yarn build:cf` → `wrangler pages dev .vercel/output/static`
   - Cloudflare Pages: Git 連携で自動デプロイ

5. **Vercel との併用**
   - `.vercel/output` に Vercel ビルド結果あり
   - Cloudflare へのデプロイと並行実施可能

---

## 改善提案

### 優先度 HIGH（重要な改善）

#### 1. API 連携の実装
**現状**: データがハードコード
**改善策**:
- バックエンド API の構築（Golang、Node.js など）
- `postAtom.ts` のデータを API から取得
- `getAllPosts()` 関数の修正（useAtom をサーバー側で使用不可）

**ファイル**: `src/store/postAtom.ts`, `src/utils/article.ts`

#### 2. エラーハンドリングの向上
**現状**: 簡素なエラー表示
**改善策**:
- ErrorBoundary コンポーネントの追加
- 詳細なエラーメッセージ表示
- リトライ機能の実装

**実装例**:
```typescript
// src/app/_components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{children: ReactNode}> {
  // エラーハンドリングロジック
}
```

#### 3. イメージ最適化
**現状**: 通常の`<img>`タグ使用、大きな画像ファイル
**改善策**:
- Next.js `<Image>` コンポーネント導入
- WebP 変換
- レスポンシブ画像対応

**ファイル**: `src/app/(use-header)/home/_components/view/Page/index.tsx`, `src/app/(use-header)/production/_components/view/Page/card.tsx`

#### 4. 未実装ページの完成
**現状**: Profyle、Skill がメンテナンス中
**改善策**:
- プロフィール情報の実装
- スキルセクションの実装（技術スタック、経歴など）

**ファイル**: `src/app/(use-header)/profyle/`, `src/app/(use-header)/skill/`

---

### 優先度 MEDIUM（推奨される改善）

#### 5. テストスイートの追加
**改善策**:
- Jest + React Testing Library のセットアップ
- コンポーネント単体テスト
- E2E テスト（Playwright、Cypress）

**実装タスク**:
```bash
yarn add -D jest @testing-library/react @testing-library/jest-dom
```

#### 6. SEO 最適化
**改善策**:
- Meta タグの動的生成
- Open Graph 対応
- sitemap.xml 自動生成
- robots.txt 設定

**ファイル**: `src/app/layout.tsx`, 各 `page.tsx`

#### 7. パフォーマンス計測と最適化
**改善策**:
- Google PageSpeed Insights でスコア測定
- Core Web Vitals の改善
- コード分割（Code Splitting）
- バンドルサイズの削減

**ツール**:
- `next/bundle-analyzer`
- Lighthouse CI

#### 8. アクセシビリティ改善
**改善策**:
- WCAG 2.1 AA レベル対応
- alt 属性の追加
- aria ラベルの追加
- キーボードナビゲーション対応

**ファイル**: 全コンポーネント

---

### 優先度 LOW（追加機能）

#### 9. 国際化 (i18n)
**改善策**:
- next-intl などで多言語対応
- 日本語/英語切り替え

#### 10. ダークモード
**改善策**:
- MUI の `useColorScheme` 導入
- ダークテーマの定義

#### 11. 検索・フィルター機能
**改善策**:
- プロダクション一覧にフィルター追加
- タグでのフィルタリング
- 検索機能

#### 12. ページネーション
**改善策**:
- プロダクション一覧のページネーション
- 無限スクロール対応

---

## 潜在的な問題点

### セキュリティ

🔴 **データ漏洩リスク**
- プロダクション内容がハードコード
- 環境変数や API から取得推奨

🔴 **外部画像 URL**
- `https://production.w3st.net/` などの外部URL
- キャッシュ失敗時の対応なし

### パフォーマンス

🟡 **バンドルサイズ**
- MUI + Emotion + Framer-motion を全ページで読み込み
- Code splitting による最適化検討

🟡 **イメージ最適化**
- `public/` の画像（2.8MB の red_wasi.jpg など）が圧縮されていない

### 機能・ビジネスロジック

🟡 **不完成なページ**
- Profyle と Skill がメンテナンス中

🟡 **データソース**
- API なしの完全静的サイト
- データベース連携なし（更新は手動コード変更）

### 開発体験

🔴 **ユーティリティ関数の誤り**
```typescript
// src/utils/article.ts
export async function getAllPosts() {
  const [articles] = useAtom(postAtomLoadable); // ❌ useAtom はクライアントハック
  // サーバーコンポーネントで使用不可
}
```

🟡 **テストの欠落**
- Unit test, E2E test が存在しない

🟡 **型定義の不完全性**
- `Post` と `PostPage` が別々に定義（統合可能性）

---

## アクションアイテム一覧

### すぐに取り組むべきタスク

1. ✅ **`src/utils/article.ts` の修正**
   - useAtom をサーバーコンポーネントで使えないように修正

2. ✅ **ErrorBoundary の追加**
   - `src/app/_components/ErrorBoundary.tsx` 作成

3. ✅ **イメージコンポーネントの移行**
   - `<img>` → `<Image>` に置き換え

4. ✅ **未実装ページの完成**
   - Profyle ページの実装
   - Skill ページの実装

### 中期的に取り組むべきタスク

5. ⏳ **API バックエンドの構築**
   - RESTful API または GraphQL
   - データベース連携（PostgreSQL など）

6. ⏳ **テストスイートの追加**
   - Jest + React Testing Library
   - E2E テスト

7. ⏳ **SEO 最適化**
   - Meta タグ、Open Graph、sitemap

8. ⏳ **パフォーマンス最適化**
   - バンドルサイズ削減
   - Code splitting

### 長期的に検討すべきタスク

9. 🔮 **国際化対応**
   - 日本語/英語切り替え

10. 🔮 **ダークモード実装**
    - テーマ切り替え機能

11. 🔮 **検索・フィルター機能**
    - プロダクション一覧の検索

12. 🔮 **アクセシビリティ改善**
    - WCAG 2.1 AA レベル対応

---

## まとめ

このプロジェクトは、**モダンな Next.js + TypeScript + MUI のポートフォリオサイト**で、以下の特徴があります。

### 強み

- ✅ TypeScript strict mode による型安全性
- ✅ Next.js App Router の活用
- ✅ Cloudflare Pages 対応（Edge Runtime）
- ✅ 和風デザインの統一感
- ✅ Jotai による状態管理
- ✅ Markdown + KaTeX 対応の記事システム

### 課題

- ⚠️ データがハードコード（API 化が必要）
- ⚠️ 未実装ページあり（Profyle、Skill）
- ⚠️ テストの欠落
- ⚠️ エラーハンドリングが簡素
- ⚠️ イメージ最適化が不十分

### 推奨される次のステップ

1. **API 連携の実装**でデータの動的管理を実現
2. **未実装ページの完成**でサイトを完全に
3. **テストスイートの追加**で品質保証
4. **パフォーマンス最適化**でユーザー体験向上

**技術的成熟度**: 中程度以上
**実装進捗**: 約80%
**スケーラビリティ**: API 化で大幅に向上可能

---

**レポート作成**: Claude Code
**最終更新**: 2026-02-07
