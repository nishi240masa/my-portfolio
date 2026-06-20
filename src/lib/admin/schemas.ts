// 管理 API のリクエスト Zod スキーマ
// SSOT である src/lib/schemas/ から再エクスポートする薄いラッパ。
// 既存の API routes が現行の import 経路（@/lib/admin/schemas）を変えずに動くようにする。

export {
  productionSchema,
  productionInputSchema,
  productionSummarySchema,
  productionDetailSchema,
} from '@/lib/schemas/production';

export { profileSchema } from '@/lib/schemas/profile';

export { skillsSchema } from '@/lib/schemas/skill';

export { homeSchema } from '@/lib/schemas/home';
