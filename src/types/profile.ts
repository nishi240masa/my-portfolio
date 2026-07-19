// プロフィールページのコンテンツ型 — SSOTスキーマから z.infer して再エクスポート。
// 既存呼び出し箇所が使用する型名 (TimelineItem / SnsLink / Profile) を維持する。
export type { TimelineItem, SnsLink, Profile } from '@/lib/schemas/profile';
