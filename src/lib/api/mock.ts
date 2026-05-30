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
    image: 'https://production.w3st.net/MD2S.jpeg',
    description: 'Markdownから高品質なスライドを自動生成するWebサービス。',
    date: '2024-10-01',
    tags: ['Golang', 'PostgreSQL', 'Docker'],
  },
  {
    id: 2,
    title: 'w3st CMS',
    image: 'https://production.w3st.net/westCMS-img.png',
    description: 'ドメイン駆動設計で構築した独自ヘッドレスCMS。スケーラブルなコンテンツ配信を実現。',
    date: '2024-09-15',
    tags: ['Golang', 'AWS', 'DDD'],
  },
  {
    id: 3,
    title: 'センサー連動型対戦ゲーム',
    image: 'https://production.w3st.net/image/sensor-game.png',
    description: 'Raspberry PiとWebSocketを活用した、リアルタイムIoT対戦ゲーム。',
    date: '2024-08-20',
    tags: ['Golang', 'WebSocket', 'Next.js', 'IoT'],
  },
  {
    id: 4,
    title: 'Design System & Component Library',
    description: 'フロントエンド開発の効率化とUIの統一を目的とした、React向け社内用コンポーネントライブラリ。',
    date: '2024-07-10',
    tags: ['React', 'TypeScript', 'Storybook', 'Figma'],
  },
  {
    id: 5,
    title: '高トラフィック対応 GraphQL BFF',
    description: 'マイクロサービスアーキテクチャのフロントエンドとバックエンドを繋ぐ、ApolloベースのBFF。',
    date: '2024-06-05',
    tags: ['TypeScript', 'GraphQL', 'Node.js', 'Apollo'],
  },
];

export const mockPostDetails: PostPage[] = [
  {
    id: 1,
    title: 'MD2S',
    image: 'https://production.w3st.net/MD2S.jpeg',
    description: 'Markdownから高品質なスライドを自動生成するWebサービス。',
    date: '2024-10-01',
    tags: ['Golang', 'PostgreSQL', 'Docker', 'Gin'],
    peopleNum: 4,
    role: 'バックエンド開発 / アーキテクチャ設計',
    period: '約2ヶ月',
    technologys: ['Golang', 'GORM', 'Gin', 'Docker', 'PostgreSQL', 'React'],
    content: `# MD2S (Markdown to Slide)

Markdown形式で記述したテキストから、ブラウザ上で直感的にプレゼンテーションスライドを生成できるWebアプリケーションです。

## プロジェクトの背景

エンジニアがスライド資料を作成する際、GUIのプレゼンテーションソフトを使用するのは学習コストやレイアウト調整の手間がかかります。普段から慣れ親しんでいるMarkdownだけで、高品質なスライドを作れるツールがあれば便利だと考え、開発に至りました。

## 主な機能
- **リアルタイムプレビュー**: 左ペインでMarkdownを編集し、右ペインで即座にスライドの仕上がりを確認できます。
- **テーマカスタマイズ**: ダークモードや複数パレットからのカラーテーマ切り替え機能。
- **PDFエクスポート**: 完成したスライドをボタンひとつでPDF形式に出力し、ローカルに保存できます。
- **シェア機能**: 生成したスライドに一意のURLを発行し、チーム内で素早く共有可能。

## アーキテクチャと技術スタック

本システムのバックエンドは**Golang**と**Gin**フレームワークを採用し、軽量かつ高速なAPIサーバーを構築しています。データベースには**PostgreSQL**を利用し、**GORM**を通じてデータを永続化。

インフラ環境は全て**Docker**でコンテナ化されており、開発環境と本番環境の差異をなくすことで、デプロイの安定性を高めました。

\`\`\`go
// サンプル: スライド保存APIのハンドラ
func (h *SlideHandler) SaveSlide(c *gin.Context) {
    var req SaveSlideRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
        return
    }

    slide, err := h.UseCase.CreateOrUpdate(c.Request.Context(), req.UserID, req.Content)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save slide"})
        return
    }

    c.JSON(http.StatusOK, slide)
}
\`\`\`

## 課題と解決策

Markdownパーサーとスライドレンダリングエンジンの間で、独自の拡張記法（例: スライドの区切り文字 \`---\` の扱い）をどう同期するかが課題でした。
解決策として、フロントエンド側で構文解析（AST）を行い、スライドごとのデータチャンクに分割した上でレンダリングする専用のミドルウェア層を実装。これにより、パフォーマンスを落とさずに複雑なレイアウト要件にも対応できるようになりました。
`,
  },
  {
    id: 2,
    title: 'w3st CMS',
    image: 'https://production.w3st.net/westCMS-img.png',
    description: 'ドメイン駆動設計で構築した独自ヘッドレスCMS。スケーラブルなコンテンツ配信を実現。',
    date: '2024-09-15',
    tags: ['Golang', 'AWS', 'DDD', 'Clean Architecture'],
    peopleNum: 1,
    role: 'フルスタック開発 / インフラ構築',
    period: '5ヶ月',
    technologys: ['Golang', 'PostgreSQL', 'Docker', 'AWS', 'ECS', 'Terraform'],
    content: `# w3st CMS

独自のオウンドメディアやポートフォリオサイトを効率的に管理・配信するためのヘッドレスCMSです。高い拡張性と保守性を両立させるため、ドメイン駆動設計（DDD）とクリーンアーキテクチャを採用しています。

## 開発の目的

既存のSaaS型CMS（Contentful, microCMSなど）は便利ですが、細かい権限制御や独自のデータモデリングにおいて制限を感じる場面がありました。要件に合わせた柔軟なコンテンツスキーマを定義し、さらにGo言語によるバックエンド開発の知見を深めるために、自作CMSのフルスクラッチ開発を決意しました。

## アーキテクチャの概要

システム全体を以下の4つの層に分割しています。

1. **Domain Layer**: コンテンツ、ユーザー、カテゴリなどのビジネスルールをカプセル化。
2. **Usecase Layer**: アプリケーション固有のユースケース（記事の公開、下書き保存など）を実装。
3. **Interface / Adapter Layer**: HTTPリクエストのルーティング（Gin）や、DBモデルからドメインモデルへの変換。
4. **Infrastructure Layer**: PostgreSQLへのクエリ実行（GORM）や外部ストレージ（S3）への画像アップロード。

この分離により、例えばデータベースのORマッパーを変更する際も、ドメイン層やユースケース層には一切影響を与えずにリファクタリングが可能です。

## インフラ構成 (AWS)

インフラストラクチャは**Terraform**を用いてコード化（IaC）し、AWS上に構築しました。

- **コンピューティング**: ECS (Fargate) を使用し、トラフィックに応じたオートスケーリングを設定。
- **データベース**: Amazon RDS (PostgreSQL) をマルチAZ配置で可用性を確保。
- **メディア保存**: 画像やファイルは S3 に保存し、CloudFront 経由でCDN配信。

\`\`\`yaml
# Docker Composeの例（ローカル開発環境）
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_DSN=host=db user=postgres password=postgres dbname=cms port=5432 sslmode=disable
    depends_on:
      - db
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cms
    ports:
      - "5432:5432"
\`\`\`

## 今後の展望

現在は個人プロジェクト用途での利用がメインですが、将来的には複数テナント（マルチテナント）対応や、GraphQL APIの提供、Webhookによる静的サイトジェネレーター（Next.js等）の自動ビルド連携機能を拡充していく予定です。
`,
  },
  {
    id: 3,
    title: 'センサー連動型対戦ゲーム',
    image: 'https://production.w3st.net/image/sensor-game.png',
    description: 'Raspberry PiとWebSocketを活用した、リアルタイムIoT対戦ゲーム。',
    date: '2024-08-20',
    tags: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi', 'IoT'],
    peopleNum: 3,
    role: 'バックエンド・IoTデバイス開発',
    period: '約1.5ヶ月',
    technologys: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi', 'Python', '加速度センサー'],
    content: `# センサー連動型対戦ゲーム

Raspberry Piに接続された加速度センサーをコントローラーとして使用し、ブラウザ上でリアルタイムに進行する対戦型Webゲームです。IoT技術とモダンなWebフロントエンド技術の融合をテーマにしたハッカソン向けプロジェクトとして制作しました。

## システム構成

1. **IoTエッジデバイス (Raspberry Pi)**
   - プレイヤーの手元にあるコントローラー。
   - 3軸加速度センサーモジュール（MPU6050など）からデータを取得。
   - Pythonスクリプトでセンサー値をフィルタリング（カルマンフィルタ適用）し、WebSocket経由でサーバーへ送信。

2. **ゲームサーバー (Golang)**
   - クライアントとエッジデバイス間の通信を仲介。
   - WebSocket接続をゴルーチン（Goroutine）で並行処理し、極めて低いレイテンシでのデータブロードキャストを実現。
   - ルーム管理機能（マッチメイキング、ゲーム状態の同期）。

3. **クライアントUI (Next.js)**
   - サーバーから流れてくるリアルタイム座標データを元に、CanvasAPI（またはWebGL）を利用して自機や敵機の位置を描画。
   - Reactの宣言的なUIで、スコアボードやエフェクトを滑らかに表現。

## 直面した課題とアプローチ

### 1. センサーのノイズ除去と遅延
生データをそのまま送信するとキャラクターがブレてしまう問題がありました。エッジ側で単純な移動平均フィルタをかけたところ遅延が目立ったため、予測と補正を組み合わせたフィルタリングアルゴリズムを導入し、滑らかさと応答性を両立させました。

### 2. WebSocket接続の負荷対策
毎秒数十回の頻度で送られてくるメッセージを、接続している全クライアントに配信する必要がありました。Golangの強力な並行処理モデルを活かし、Roomごとのハブとなる構造体を定義。チャネル（Channel）を用いて安全かつ非同期にメッセージをルーティングする設計としました。

\`\`\`go
// WebSocketのハブルーティングの一部
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
\`\`\`

## 結果

ハッカソンでは、実際にデバイスを振り回して遊ぶというフィジカルな体験が高く評価され、技術部門賞を受賞することができました。
`,
  },
  {
    id: 4,
    title: 'Design System & Component Library',
    description: 'フロントエンド開発の効率化とUIの統一を目的とした、React向け社内用コンポーネントライブラリ。',
    date: '2024-07-10',
    tags: ['React', 'TypeScript', 'Storybook', 'Figma'],
    peopleNum: 2,
    role: 'フロントエンド開発 / UI設計',
    period: '2ヶ月',
    technologys: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS', 'Figma', 'NPM Workspace'],
    content: `# Design System & Component Library

プロダクトチーム全体の開発スピード向上と、アプリケーション間でのUI/UXの一貫性を担保するために構築した、独自のReactコンポーネントライブラリです。

## プロジェクトの目的

複数のWebアプリケーションを並行して開発する中で、ボタンやモーダル、フォーム要素などのUI部品が各プロジェクトでバラバラに再実装されているという課題がありました。これにより、デザインのブレや、修正時の重複作業が発生していました。
この問題を解決するため、Figma上のデザイントークンと同期した「Single Source of Truth（信頼できる唯一の情報源）」となるライブラリを開発しました。

## 主な特徴

- **デザイントークンの活用**: 色、タイポグラフィ、スペーシングなどの基礎要素をJSONとして定義。CSS Variablesを生成するスクリプトを組み込み、一元管理。
- **Storybookによるカタログ化**: 全コンポーネントをStorybook上でドキュメント化し、デザイナーとエンジニアのコミュニケーションハブとして活用。
- **アクセシビリティ (a11y)**: WAI-ARIAのベストプラクティスに従い、キーボード操作やスクリーンリーダーに配慮した実装（Radix UIなどのヘッドレスUIを一部ラップして利用）。
- **完全な型定義**: TypeScriptによる厳格なPropsの型付けにより、利用側での開発体験（DX）を大きく向上。

## パッケージ公開とCI/CD

ライブラリは社内のプライベートNPMレジストリへ公開。GitHub Actionsを利用し、以下のCI/CDパイプラインを構築しました。

1. **Lint / Format**: ESLint, Prettierによる静的解析。
2. **Test**: Jest + React Testing Libraryを用いた単体テスト。
3. **Visual Regression Test**: Chromaticを導入し、予期せぬデザイン崩れをPR単位で検知。
4. **Publish**: セマンティックバージョニングに基づく自動リリース。

> **Note**: 現在このプロジェクトにはサムネイル画像が設定されていませんが、UI側で適切にプレースホルダが表示されるようになっています。
`,
  },
  {
    id: 5,
    title: '高トラフィック対応 GraphQL BFF',
    description: 'マイクロサービスアーキテクチャのフロントエンドとバックエンドを繋ぐ、ApolloベースのBFF。',
    date: '2024-06-05',
    tags: ['TypeScript', 'GraphQL', 'Node.js', 'Apollo Server'],
    peopleNum: 1,
    role: 'バックエンド開発 / API設計',
    period: '約3週間',
    technologys: ['TypeScript', 'GraphQL', 'Apollo Server', 'Redis', 'Express'],
    content: `# 高トラフィック対応 GraphQL BFF

複数のマイクロサービス（ユーザー管理、商品管理、決済など）から取得したデータを集約し、フロントエンド（Web、モバイルアプリ）に最適な形で提供するためのBFF（Bckend For Frontend）層をGraphQLで構築した事例です。

## 背景

各マイクロサービスが提供するREST APIをフロントエンドから直接呼び出す構成では、画面表示に必要な情報を揃えるためにN+1リクエストが発生し、ネットワーク帯域の浪費や遅延が問題化していました。また、UI側に不要なデータ加工のロジックが漏れ出すという課題もありました。

## アーキテクチャとアプローチ

そこで、フロントエンドとマイクロサービスの間に **Apollo Server (Node.js)** を配置しました。

- **データの集約と整形**: GraphQLのスキーマを定義し、UIが要求する形式にデータを加工して一度のリクエストで返却。
- **DataLoaderの導入**: リゾルバ内でのマイクロサービス呼び出しにおいて発生するN+1問題を解決するため、\`dataloader\` ライブラリを活用。IDをバッチ化して一括取得する仕組みを実装。
- **キャッシュ戦略**: Redisを利用した分散キャッシュ層を構築。変更頻度が低く、読み込みの多いマスタデータ等をGraphQLのリゾルバレベルでキャッシュし、バックエンド群への負荷を大幅に削減。

\`\`\`typescript
// DataLoaderの簡単な実装例
const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  // 複数のIDをまとめてバックエンドAPIへリクエスト
  const response = await userMicroservice.getUsersByIds(userIds);
  
  // IDの順序に合わせて結果をマッピング
  const userMap = new Map(response.data.map(u => [u.id, u]));
  return userIds.map(id => userMap.get(id) || null);
});
\`\`\`

## 成果

BFF層の導入により、フロントエンドの初期ロード時間を平均で40%短縮。また、バックエンドサービスの負荷（特にDBのREADクエリ）もピーク時で約30%削減することに成功しました。フロントエンドエンジニアはGraphQLの自己文書化されたスキーマを通じて、直感的にデータを取得できるようになりました。
`,
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
