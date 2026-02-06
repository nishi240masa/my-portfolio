# バックエンドAPI統合ガイド

**作成日**: 2026-02-07
**バージョン**: 1.0.0

---

## 目次

1. [概要](#概要)
2. [準備完了項目](#準備完了項目)
3. [統合手順](#統合手順)
4. [環境変数の設定](#環境変数の設定)
5. [APIエンドポイント仕様](#apiエンドポイント仕様)
6. [使用方法](#使用方法)
7. [トラブルシューティング](#トラブルシューティング)
8. [次のステップ](#次のステップ)

---

## 概要

このプロジェクトは、別プロジェクトで動作しているバックエンドAPIと統合する準備が整っています。
このガイドでは、実際にAPIを接続するための手順を説明します。

### 前提条件

- バックエンドAPIが稼働していること
- APIエンドポイントとレスポンス形式が定義されていること
- CORS設定がフロントエンドからのリクエストを許可していること

---

## 準備完了項目

以下のファイルが作成され、API統合の準備が整っています。

### ✅ 環境変数テンプレート

- `.env.example` - 環境変数のテンプレート

### ✅ 型定義

- `src/types/api.ts` - APIレスポンスの型定義
- `src/types/post.ts` - 既存のアプリケーション型定義

### ✅ 設定ファイル

- `src/config/api.ts` - APIエンドポイント、設定定数

### ✅ APIクライアント層

- `src/lib/api/client.ts` - HTTP通信を担当するクライアント
- `src/lib/api/errors.ts` - エラーハンドリング
- `src/lib/api/posts.ts` - プロダクションAPI関数
- `src/lib/api/mock.ts` - モックデータ（開発用）

### ✅ ドキュメント

- `TASK_LIST.md` - 統合タスクの更新版
- `API_INTEGRATION_GUIDE.md`（このファイル）

---

## 統合手順

### ステップ 1: 環境変数の設定

`.env.example` をコピーして `.env.local` を作成します。

```bash
cp .env.example .env.local
```

`.env.local` を編集して、バックエンドAPIのURLを設定します。

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api  # バックエンドAPIのURL
NEXT_PUBLIC_USE_MOCK_DATA=false                      # 実APIを使用する場合はfalse
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_COUNT=3
```

### ステップ 2: バックエンドAPIのCORS設定

バックエンドAPIで、フロントエンドからのリクエストを許可するCORS設定を行います。

**Golang (Gin) の例**:
```go
import "github.com/gin-contrib/cors"

func main() {
    r := gin.Default()

    // CORS設定
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000", "https://your-domain.com"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

    // ...
}
```

### ステップ 3: 外部画像URLの設定（オプション）

バックエンドAPIから返される画像URLが外部ドメインの場合、`next.config.mjs` に設定を追加します。

```javascript
// next.config.mjs
const nextConfig = {
  // 既存の設定...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'production.w3st.net',
      },
      {
        protocol: 'https',
        hostname: 'west-m.net',
      },
      {
        protocol: 'https',
        hostname: 'your-api-domain.com', // バックエンドのドメイン
      },
    ],
  },
};
```

### ステップ 4: postAtom の更新

`src/store/postAtom.ts` を実際のAPI呼び出しに変更します。

**現在の実装（ハードコード）**:
```typescript
// src/store/postAtom.ts
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

export const postAtom = atom<PostPage[]>([/* ハードコードデータ */]);
export const postAtomLoadable = loadable(postAtom);
```

**API連携版（推奨）**:

**方法1: Jotai async atom を使用**
```typescript
// src/store/postAtom.ts
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { fetchAllPosts } from '@/lib/api/posts';
import { API_CONFIG } from '@/config/api';
import { mockPostDetails } from '@/lib/api/mock';

// 非同期atom
export const postAtom = atom(async () => {
  if (API_CONFIG.useMockData) {
    // 開発環境: モックデータを使用
    const { mockPostDetails } = await import('@/lib/api/mock');
    return mockPostDetails;
  }

  // 本番環境: 実APIから取得
  return await fetchAllPosts();
});

export const postAtomLoadable = loadable(postAtom);
```

**方法2: React Query (TanStack Query) と併用**
```bash
yarn add @tanstack/react-query jotai-tanstack-query
```

```typescript
// src/store/postAtom.ts
import { atomWithQuery } from 'jotai-tanstack-query';
import { fetchAllPosts } from '@/lib/api/posts';

export const postAtom = atomWithQuery(() => ({
  queryKey: ['posts'],
  queryFn: fetchAllPosts,
  staleTime: 1000 * 60 * 5, // 5分間キャッシュ
}));
```

### ステップ 5: 動作確認

開発サーバーを起動して動作確認します。

```bash
yarn dev
```

ブラウザで `http://localhost:3000` にアクセスし、以下を確認します：

1. プロダクション一覧ページ（`/production`）が表示される
2. プロダクション詳細ページ（`/production/[id]`）が表示される
3. ローディング状態が適切に表示される
4. エラーが発生した場合、エラーメッセージが表示される

### ステップ 6: ビルド確認

本番ビルドが成功するか確認します。

```bash
yarn build
```

Cloudflare Pages向けビルドも確認します。

```bash
yarn build:cf
```

---

## 環境変数の設定

### 開発環境（`.env.local`）

```bash
# モックデータを使用（バックエンドなしで開発）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_COUNT=3
```

### 本番環境（Cloudflare Pages）

Cloudflare Pages のダッシュボードで環境変数を設定します。

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com/api
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_COUNT=3
```

---

## APIエンドポイント仕様

バックエンドAPIは以下のエンドポイントを実装する必要があります。

### 1. プロダクション一覧取得

**エンドポイント**: `GET /api/posts`

**クエリパラメータ**:
- `page` (optional): ページ番号（デフォルト: 1）
- `limit` (optional): 1ページあたりの件数（デフォルト: 10）
- `tags` (optional): タグでフィルタ（複数指定可）
- `sortBy` (optional): ソート項目（`date` or `title`）
- `order` (optional): ソート順（`asc` or `desc`）

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "MD2S",
        "image": "https://production.w3st.net/image/md2s.png",
        "description": "記事投稿・スライド変換サイト",
        "date": "2024-10-01T00:00:00Z",
        "tags": ["Golang", "PostgreSQL", "Docker"],
        "createdAt": "2024-10-01T00:00:00Z",
        "updatedAt": "2024-10-01T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

### 2. プロダクション詳細取得

**エンドポイント**: `GET /api/posts/:id`

**パスパラメータ**:
- `id`: プロダクションID

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "MD2S",
      "image": "https://production.w3st.net/image/md2s.png",
      "description": "記事投稿・スライド変換サイト",
      "date": "2024-10-01T00:00:00Z",
      "tags": ["Golang", "PostgreSQL", "Docker"],
      "peopleNum": 4,
      "role": "バックエンド開発",
      "period": "1週間",
      "technologys": ["Golang", "GORM", "Gin", "Docker", "PostgreSQL"],
      "content": "# MD2S\n\nMarkdownで記事を投稿し...",
      "createdAt": "2024-10-01T00:00:00Z",
      "updatedAt": "2024-10-01T00:00:00Z"
    }
  }
}
```

### 3. エラーレスポンス

**レスポンス例**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "プロダクションが見つかりませんでした",
    "details": {
      "id": 999
    }
  }
}
```

---

## 使用方法

### コンポーネントでAPIを使用する

#### 方法1: Jotai loadable を使用（既存の実装）

```typescript
// src/app/(use-header)/production/_components/logic/Page.tsx
'use client';

import { useAtom } from 'jotai';
import { postAtomLoadable } from '@/store/postAtom';

export default function ProductionPageLogic() {
  const [articles] = useAtom(postAtomLoadable);

  if (articles.state === 'loading') {
    return <div>読み込み中...</div>;
  }

  if (articles.state === 'hasError') {
    return <div>エラーが発生しました: {articles.error.message}</div>;
  }

  return (
    <div>
      {articles.data.map((post) => (
        <CardPage key={post.id} data={post} />
      ))}
    </div>
  );
}
```

#### 方法2: 直接API関数を使用

```typescript
'use client';

import { useEffect, useState } from 'react';
import { fetchPosts } from '@/lib/api/posts';
import type { Post } from '@/types/post';

export default function ProductionList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## トラブルシューティング

### 1. CORS エラー

**エラー**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**解決策**:
- バックエンドAPIのCORS設定を確認
- `Access-Control-Allow-Origin` ヘッダーが正しく設定されているか確認

### 2. タイムアウトエラー

**エラー**: `TimeoutError: リクエストがタイムアウトしました`

**解決策**:
- `.env.local` の `NEXT_PUBLIC_API_TIMEOUT` を増やす
- バックエンドAPIのレスポンス時間を確認

### 3. 認証エラー

**エラー**: `UnauthorizedError: 認証が必要です`

**解決策**:
- 認証が必要な場合、APIクライアントにトークンを追加
```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
};
apiClient.get(endpoint, { headers });
```

### 4. 画像が表示されない

**エラー**: 外部URLの画像が表示されない

**解決策**:
- `next.config.mjs` の `images.remotePatterns` に画像ドメインを追加

### 5. モックデータから切り替わらない

**症状**: 実APIを設定したのにモックデータが表示される

**解決策**:
- `.env.local` の `NEXT_PUBLIC_USE_MOCK_DATA=false` を確認
- 開発サーバーを再起動（環境変数の変更後は再起動が必要）

---

## 次のステップ

### 完了した項目
- ✅ 環境変数テンプレート作成
- ✅ API型定義作成
- ✅ APIクライアント層実装
- ✅ モックデータ作成
- ✅ 統合ガイド作成

### 実施すべき項目

#### L-03: postAtom のAPI連携対応（4時間）

**タスク詳細**: [TASK_LIST.md](./TASK_LIST.md#l-03-postatom-のapi連携対応)

1. `src/store/postAtom.ts` を更新
2. ローディング・エラー状態の確認
3. 既存コンポーネントの動作確認

#### その他の推奨タスク

1. **エラーハンドリングの改善**（H-02）
   - ErrorBoundary の追加

2. **ローディング表示の改善**（H-09）
   - スケルトンUI の実装

3. **テストの追加**（M-01, M-02）
   - API関数の単体テスト
   - モックを使用したコンポーネントテスト

---

## 参考リンク

- [TASK_LIST.md](./TASK_LIST.md) - 全タスクリスト
- [PROJECT_REPORT.md](./PROJECT_REPORT.md) - プロジェクトサーベイ
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Jotai Documentation](https://jotai.org)
- [TanStack Query](https://tanstack.com/query/latest)

---

**作成者**: Claude Code
**最終更新**: 2026-02-07
**バージョン**: 1.0.0
