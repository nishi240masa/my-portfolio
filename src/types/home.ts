// ホームページのコンテンツ型 — SSOTスキーマから z.infer して再エクスポート。
// 既存呼び出し箇所が使用する型名 (HomeIndexItem / HomeContent) を維持する。
export type { HomeIndexItem, HomeContent } from '@/lib/schemas/home';
