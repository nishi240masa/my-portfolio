/**
 * モックデータ
 * 開発環境でバックエンドAPIが使用できない場合のフォールバック
 */

import type { Post, PostPage } from '@/types/post';

// ===========================
// モックデータ
// ===========================

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'MD2S',
    image: 'https://production.w3st.net/image/md2s.png',
    description: '記事投稿・スライド変換サイト',
    date: '2024-10-01',
    tags: ['Golang', 'PostgreSQL', 'Docker'],
  },
  {
    id: 2,
    title: 'w3st CMS',
    image: 'https://west-m.net/image/headlessCMS.png',
    description: 'ヘッドレスCMS',
    date: '2024-09-15',
    tags: ['Golang', 'AWS', 'DDD'],
  },
  {
    id: 3,
    title: 'センサー連動型対戦ゲーム',
    image: 'https://production.w3st.net/image/sensor-game.png',
    description: 'IoT + リアルタイム通信ゲーム',
    date: '2024-08-20',
    tags: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi'],
  },
  {
    id: 4,
    title: 'タイトル4',
    image: 'https://production.w3st.net/image/title4.png',
    description: '説明4',
    date: '2024-07-10',
    tags: ['React', 'Node.js'],
  },
  {
    id: 5,
    title: 'タイトル5',
    image: 'https://production.w3st.net/image/title5.png',
    description: '説明5',
    date: '2024-06-05',
    tags: ['TypeScript', 'GraphQL'],
  },
];

export const mockPostDetails: PostPage[] = [
  {
    id: 1,
    title: 'MD2S',
    image: 'https://production.w3st.net/image/md2s.png',
    description: '記事投稿・スライド変換サイト',
    date: '2024-10-01',
    tags: ['Golang', 'PostgreSQL', 'Docker'],
    peopleNum: 4,
    role: 'バックエンド開発',
    period: '1週間',
    technologys: ['Golang', 'GORM', 'Gin', 'Docker', 'PostgreSQL'],
    content: `# MD2S

Markdownで記事を投稿し、スライドに変換できるWebサービスです。

## 概要
- Markdownエディタでの記事作成
- スライド形式での表示
- 記事の共有機能

## 技術スタック
- **バックエンド**: Golang, Gin
- **データベース**: PostgreSQL, GORM
- **インフラ**: Docker`,
  },
  {
    id: 2,
    title: 'w3st CMS',
    image: 'https://west-m.net/image/headlessCMS.png',
    description: 'ヘッドレスCMS',
    date: '2024-09-15',
    tags: ['Golang', 'AWS', 'DDD'],
    peopleNum: 1,
    role: 'フルスタック開発',
    period: '5ヶ月',
    technologys: ['Golang', 'PostgreSQL', 'Docker', 'AWS', 'DDD'],
    content: `# w3st CMS

DDDアーキテクチャで実装したヘッドレスCMSです。

## 概要
- RESTful APIでのコンテンツ管理
- ドメイン駆動設計による実装
- AWSでのスケーラブルなインフラ

## アーキテクチャ
- ドメイン層、アプリケーション層、インフラ層の分離
- Clean Architecture の採用`,
  },
  {
    id: 3,
    title: 'センサー連動型対戦ゲーム',
    image: 'https://production.w3st.net/image/sensor-game.png',
    description: 'IoT + リアルタイム通信ゲーム',
    date: '2024-08-20',
    tags: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi'],
    peopleNum: 3,
    role: 'バックエンド・IoT開発',
    period: '1ヶ月',
    technologys: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi', 'センサー'],
    content: `# センサー連動型対戦ゲーム

Raspberry Piのセンサーと連動したリアルタイム対戦ゲームです。

## 概要
- センサー入力によるゲーム操作
- WebSocketによるリアルタイム通信
- Next.jsでのフロントエンド実装

## 技術的な挑戦
- センサーデータの高速処理
- 低遅延のリアルタイム通信`,
  },
  {
    id: 4,
    title: 'タイトル4',
    image: 'https://production.w3st.net/image/title4.png',
    description: '説明4',
    date: '2024-07-10',
    tags: ['React', 'Node.js'],
    peopleNum: 2,
    role: 'フロントエンド開発',
    period: '2週間',
    technologys: ['React', 'Node.js', 'Express'],
    content: `# タイトル4

プロジェクト4の詳細説明。`,
  },
  {
    id: 5,
    title: 'タイトル5',
    image: 'https://production.w3st.net/image/title5.png',
    description: '説明5',
    date: '2024-06-05',
    tags: ['TypeScript', 'GraphQL'],
    peopleNum: 1,
    role: 'バックエンド開発',
    period: '3週間',
    technologys: ['TypeScript', 'GraphQL', 'Apollo Server'],
    content: `# タイトル5

プロジェクト5の詳細説明。`,
  },
];

// ===========================
// モック関数
// ===========================

/**
 * モックプロダクション一覧を取得
 */
export async function fetchMockPosts(): Promise<Post[]> {
  // 実際のAPIのレスポンス時間をシミュレート
  await sleep(500);
  return mockPosts;
}

/**
 * モックプロダクション詳細を取得
 */
export async function fetchMockPostById(id: number | string): Promise<PostPage | null> {
  await sleep(300);
  const post = mockPostDetails.find((p) => p.id === Number(id));
  return post || null;
}

/**
 * スリープ関数
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
