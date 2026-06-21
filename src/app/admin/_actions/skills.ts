'use server';

import { revalidateTag } from 'next/cache';
import { skillsRepo } from '@/lib/repositories/sync';
import { skillsSchema } from '@/lib/admin/schemas';
import type { SkillsContent } from '@/types/skill';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

export async function saveSkills(
  _prevState: ActionState<SkillsContent> | undefined,
  formData: FormData,
): Promise<ActionState<SkillsContent>> {
  const originErr = await assertSameOrigin();
  if (originErr) return originErr;
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const raw = readJsonPayload(formData);
  if (raw == null) return { ok: false, error: 'Invalid payload' };

  const parsed = skillsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const updated = await skillsRepo.update(parsed.data);
  revalidateTag('skills');
  return { ok: true, data: updated };
}
