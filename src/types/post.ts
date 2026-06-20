// 記事 / ページ の型 — SSOTスキーマから z.infer して再エクスポート。
// 既存呼び出し箇所が使用する型名 Post / PostPage を後方互換のために維持する。
import type {
  ProductionSummary,
  ProductionDetail,
} from '@/lib/schemas/production';

// 一覧/カード表示で使う最小フィールド
export type Post = ProductionSummary;

// 詳細ページで使う完全な型
export type PostPage = ProductionDetail;
