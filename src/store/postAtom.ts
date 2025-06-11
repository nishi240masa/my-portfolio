import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

const data = [
  {
    id: 1,
    title: 'MD2S',
    image: 'https://production.w3st.net/MD2S.jpeg',
    peopleNum: 4,
    role: 'バックエンド',
    period: '8月12日〜8月20日:1週間',
    technologys: ['Golang', 'GORM', 'Gin', 'Docker', 'PostgreSQL'],
    description:
      'QiitaやZennのような記事投稿・閲覧サイトを開発しました。また、記事をワンクリックでスライドに変換でき、作成したスライドも公開できる機能を実装しました。',
    date: '2024-02-01',
    tags: ['技育CAMP', 'スライド変換'],
    content: `
  # このシステムについて
  このシステムは **技育CAMP vol.18** で開発を行ったシステムです。  
  記事投稿サイトやスライド投稿サイトは数多くありますが、このシステムは **記事をスライドに変換する機能** を持っています。  
  また、スライドも公開できるため、スライドを作成する際に **Qiita** や **Zenn** に投稿する手間が省けます。  
  記事編集はMarkdown形式で記述可能で、GitHubライクなプレビューやスライド化の調整も行えます。  
  バックエンドはGo（Gin）で構築し、データベースはPostgreSQLを使用しました。
  `,
  },
  {
    id: 2,
    title: 'w3st CMS',
    image: 'https://production.w3st.net/westCMS-img.png',
    peopleNum: 1,
    role: '設計・実装・インフラ構築',
    period: '2024年10月〜2025年3月:5ヶ月',
    technologys: ['Golang', 'PostgreSQL', 'Docker', 'AWS', 'Clean Architecture', 'DDD'],
    description:
      'Jamstack向けに特化したGUI型のヘッドレスCMSを個人開発しました。ユーザーが任意のAPIスキーマをGUIで作成・管理でき、APIキーの制御、レート制限、IP制限などを備えています。',
    date: '2025-03-01',
    tags: ['個人開発', 'CMS', 'API設計'],
    content: `
  # このシステムについて
  Jamstackやフロントエンド開発者向けに設計したGUI型ヘッドレスCMSです。  
  ユーザーがGUIで自由にAPIスキーマや型定義を作成・編集でき、それに応じたREST APIが自動生成されます。  
  APIキーには **使用期限・IP制限・レート制限** を設けることが可能で、商用利用を想定した堅牢な構成です。  
  バックエンドはGo、データベースはPostgreSQL、インフラはAWS（ECS, RDS, Secrets Manager）を利用し、クリーンアーキテクチャとDDDをベースに開発を行いました。  
  API仕様はOpenAPI 3.0で文書化されています。
  `,
  },
  {
    id: 3,
    title: 'センサー連動型対戦ゲーム',
    image: 'https://west-m.net/game.jpeg',
    peopleNum: 3,
    role: 'バックエンド・リアルタイム通信',
    period: '2024年12月〜2025年1月:1ヶ月',
    technologys: ['Golang', 'WebSocket', 'Next.js', 'Raspberry Pi'],
    description:
      'Raspberry Piで取得したセンサーデータをWebSocket経由でリアルタイムにWebアプリに反映し、対戦型のゲームに応用しました。バックエンドはGoで構築しました。',
    date: '2025-01-10',
    tags: ['リアルタイム', 'ゲーム開発', 'IoT'],
    content: `
  # このシステムについて
  Raspberry Piから取得したセンサーデータ（加速度など）を **WebSocket** を用いてサーバーに送信し、リアルタイムに画面上のキャラクターを制御する対戦型ゲームです。  
  ゲームのロジックや対戦状態の管理はすべてGoで記述し、クライアントはNext.jsで構築しています。  
  複数人がリアルタイムに対戦できる設計となっており、WebSocketのセッション管理やイベント設計も含めて開発を担当しました。  
  Raspberry PiとWebアプリの双方向通信によって、物理動作が即座にゲームに反映される仕組みを実現しました。
  `,
  },
  {
    id: 4,
    title: 'タイトル4',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 4,
    role: '役割4',
    period: '期間4',
    technologys: ['技術1', '技術2'],
    description: '説明4',
    date: '2024-12-04',
    tags: ['タグ1', 'タグ2', 'タグ3'],
    content: 'ここは本文です。',
  },
  {
    id: 5,
    title: 'タイトル5',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 5,
    role: '役割5',
    period: '期間5',
    technologys: ['技術1', '技術2'],
    description: '説明5',

    tags: ['タグ1', 'タグ2', 'タグ3', 'タグ4'],
    content: 'ここは本文です。',
  },
];

const postAtom = atom(data);
export const postAtomLoadable = loadable(postAtom);
