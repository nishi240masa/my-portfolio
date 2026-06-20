// Production (作品) のZodスキーマ — SSOT
// data/productions.json の構造に従う。
import { z } from 'zod';

// ケーススタディ (採用判断材料化)
// optional な拡張ブロック。productionDetailSchema にぶら下がる。
//
// - role / period / problem / approach / result は最低限の物語フィールド
// - teamSize は任意（個人開発などでは省略可）
// - stack / metrics / links は配列で default([]) を持つ
//   .default() を含む field を含むため、productionPatchSchema は
//   productionInputSchema.partial() を経由する必要がある（既存方針通り）。
export const caseStudyMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const caseStudyLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const caseStudySchema = z.object({
  role: z.string(),
  period: z.string(),
  teamSize: z.string().optional(),
  stack: z.array(z.string()).default([]),
  problem: z.string(),
  approach: z.string(),
  result: z.string(),
  metrics: z.array(caseStudyMetricSchema).default([]),
  links: z.array(caseStudyLinkSchema).default([]),
});

// 一覧用のサマリ（リスト表示で使う最小フィールド）
export const productionSummarySchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'タイトルは必須です'),
  image: z.string().optional(),
  description: z.string(),
  date: z.string().min(1, '日付は必須です'),
  tags: z.array(z.string()).default([]),
});

// 詳細ページ用の完全な型
export const productionDetailSchema = productionSummarySchema.extend({
  peopleNum: z.number().int().nonnegative(),
  role: z.string(),
  period: z.string(),
  technologys: z.array(z.string()).default([]),
  content: z.string().default(''),
  caseStudy: caseStudySchema.optional(),
});

// 管理APIで受け取る作成（POST）用スキーマ
// id は採番されるため除外。tags/technologys/content は必須に戻す
// （.default() を残したまま .partial() を使うと、PUT で既定値が部分更新を
//  上書きしてしまうため、POST 用と PATCH 用でスキーマを分離する）。
export const productionInputSchema = productionDetailSchema.omit({ id: true }).extend({
  tags: z.array(z.string()),
  technologys: z.array(z.string()),
  content: z.string(),
});

// 管理APIで受け取る部分更新（PUT）用スキーマ
// productionInputSchema.partial() なので .default() の落とし穴がない。
export const productionPatchSchema = productionInputSchema.partial();

export type CaseStudyMetric = z.infer<typeof caseStudyMetricSchema>;
export type CaseStudyLink = z.infer<typeof caseStudyLinkSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type ProductionSummary = z.infer<typeof productionSummarySchema>;
export type ProductionDetail = z.infer<typeof productionDetailSchema>;
export type ProductionInput = z.infer<typeof productionInputSchema>;
export type ProductionPatch = z.infer<typeof productionPatchSchema>;
export type Production = ProductionDetail;

// 型レベルテスト: ProductionInput が Omit<Production, 'id'> と等価であることを保証
// （将来 productionDetailSchema と productionInputSchema が乖離したら TS error になる）
type _AssertInputEquivalent = ProductionInput extends Omit<Production, 'id'>
  ? Omit<Production, 'id'> extends ProductionInput
    ? true
    : never
  : never;
const _check: _AssertInputEquivalent = true;
void _check;
