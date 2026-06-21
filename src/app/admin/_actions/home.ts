'use server';

import { revalidateTag } from 'next/cache';
import { homeRepo } from '@/lib/repositories/sync';
import { homeSchema } from '@/lib/admin/schemas';
import type { HomeContent } from '@/types/home';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

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

  const updated = await homeRepo.update(parsed.data);
  revalidateTag('home');
  return { ok: true, data: updated };
}
