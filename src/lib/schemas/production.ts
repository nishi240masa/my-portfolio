// Production (作品) のZodスキーマ — SSOT
// data/productions.json の構造に従う。
import { z } from 'zod';

// 一覧用のサマリ（リスト表示で使う最小フィールド）
export const productionSummarySchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'タイトルは必須です'),
  image: z.string().optional(),
  description: z.string().min(1, '説明は必須です'),
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
});

// 管理APIで受け取る作成・更新用スキーマ（id は採番されるため除外）
export const productionInputSchema = productionDetailSchema.omit({ id: true });

// 後方互換: 既存 src/lib/admin/schemas.ts の productionSchema は id を持たない
// 入力スキーマと等価だったので、それを別名で公開する。
export const productionSchema = productionInputSchema;

export type ProductionSummary = z.infer<typeof productionSummarySchema>;
export type ProductionDetail = z.infer<typeof productionDetailSchema>;
export type ProductionInput = z.infer<typeof productionInputSchema>;
export type Production = ProductionDetail;
