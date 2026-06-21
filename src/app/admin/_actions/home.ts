'use server';

import { revalidateTag } from 'next/cache';
import { getHomeRepo } from '@/lib/repositories';
import { homeSchema } from '@/lib/admin/schemas';
import type { HomeContent } from '@/types/home';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

// NOTE: Server Action ファイルは 'use server' の制約により非 async export を持てない
// (runtime 等の定数 export 不可)。Server Actions は呼び出し元 (page/layout) の
// runtime ではなく自身の runtime を解決する必要があるが、'use server' file では
// runtime config は config 専用 export として扱えないため、edge への migration は
// 呼び出し元 page の runtime + auth/repository が edge-compat であれば自動的に
// edge bundle に乗る。本ファイルは runtime export なしで OK。

export async function saveHome(
  _prevState: ActionState<HomeContent> | undefined,
  formData: FormData,
): Promise<ActionState<HomeContent>> {
  const originErr = await assertSameOrigin();
  if (originErr) return originErr;
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const raw = readJsonPayload(formData);
  if (raw == null) return { ok: false, error: 'Invalid payload' };

  const parsed = homeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const repo = await getHomeRepo();
  const updated = await repo.update(parsed.data);
  revalidateTag('home');
  return { ok: true, data: updated };
}
