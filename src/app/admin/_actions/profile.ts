'use server';

import { revalidateTag } from 'next/cache';
import { getProfileRepo } from '@/lib/repositories';
import { profileSchema } from '@/lib/admin/schemas';
import type { Profile } from '@/types/profile';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

// NOTE: 'use server' file は runtime 定数 export を許可しないため、
// runtime = 'edge' は呼び出し元 (page) 経由で設定される。

export async function saveProfile(
  _prevState: ActionState<Profile> | undefined,
  formData: FormData,
): Promise<ActionState<Profile>> {
  const originErr = await assertSameOrigin();
  if (originErr) return originErr;
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const raw = readJsonPayload(formData);
  if (raw == null) return { ok: false, error: 'Invalid payload' };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const repo = await getProfileRepo();
  const updated = await repo.update(parsed.data);
  revalidateTag('profile');
  return { ok: true, data: updated };
}
