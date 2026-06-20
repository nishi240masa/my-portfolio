// スキルページのコンテンツ型 — SSOTスキーマから z.infer して再エクスポート。
// 既存呼び出し箇所が使用する型名 (SkillItem / SkillCategory / Certification / SkillsContent) を維持する。
export type {
  SkillItem,
  SkillCategory,
  Certification,
  SkillsContent,
} from '@/lib/schemas/skill';
