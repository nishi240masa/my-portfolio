'use server';

import { revalidateTag } from 'next/cache';
import { profileRepo } from '@/lib/repositories/sync';
import { profileSchema } from '@/lib/admin/schemas';
import type { Profile } from '@/types/profile';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

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

  const updated = await profileRepo.update(parsed.data);
  revalidateTag('profile');
  return { ok: true, data: updated };
}
