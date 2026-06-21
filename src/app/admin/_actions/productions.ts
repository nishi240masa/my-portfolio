'use server';

import { revalidateTag } from 'next/cache';
import { getProductionRepo } from '@/lib/repositories';
import { productionSchema } from '@/lib/admin/schemas';
import type { PostPage } from '@/types/post';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

// NOTE: 'use server' file は runtime 定数 export を許可しないため、
// runtime = 'edge' は呼び出し元 (page) 経由で設定される。

// 新規作成と部分更新で共通利用する upsert アクション。
// formData.id が空 (または undefined) なら create / 数値なら update。
export async function upsertProduction(
  _prevState: ActionState<PostPage> | undefined,
  formData: FormData,
): Promise<ActionState<PostPage>> {
  const originErr = await assertSameOrigin();
  if (originErr) return originErr;
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const raw = readJsonPayload(formData);
  if (raw == null) return { ok: false, error: 'Invalid payload' };

  const parsed = productionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const idRaw = formData.get('id');
  const idStr = typeof idRaw === 'string' ? idRaw.trim() : '';
  const hasId = idStr.length > 0;
  const id = hasId ? Number(idStr) : NaN;

  try {
    const repo = await getProductionRepo();
    if (hasId && Number.isFinite(id)) {
      const updated = await repo.update(id, parsed.data);
      revalidateTag('productions');
      revalidateTag(`production:${id}`);
      return { ok: true, data: updated };
    }
    const created = await repo.create(parsed.data);
    revalidateTag('productions');
    return { ok: true, data: created };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteProduction(id: number): Promise<ActionState> {
  const originErr = await assertSameOrigin();
  if (originErr) return originErr;
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  if (!Number.isFinite(id)) return { ok: false, error: 'Invalid id' };
  try {
    const repo = await getProductionRepo();
    await repo.delete(id);
    revalidateTag('productions');
    revalidateTag(`production:${id}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Delete failed' };
  }
}
