// 管理 API のリクエスト Zod スキーマ
// SSOT である src/lib/schemas/ から再エクスポートする薄いラッパ。
// 既存の API routes が現行の import 経路（@/lib/admin/schemas）を変えずに動くようにする。

export {
  productionInputSchema,
  // 後方互換: 旧 admin API では productionSchema という名前で参照していたので
  // 入力スキーマを同名でも公開する。SSOT 本体には置かず、ここで alias する。
  productionInputSchema as productionSchema,
  productionPatchSchema,
  productionSummarySchema,
  productionDetailSchema,
} from '@/lib/schemas/production';

export { profileSchema } from '@/lib/schemas/profile';

export { skillsSchema } from '@/lib/schemas/skill';

export { homeSchema } from '@/lib/schemas/home';
