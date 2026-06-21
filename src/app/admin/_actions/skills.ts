'use server';

import { revalidateTag } from 'next/cache';
import { getSkillsRepo } from '@/lib/repositories';
import { skillsSchema } from '@/lib/admin/schemas';
import type { SkillsContent } from '@/types/skill';
import {
  type ActionState,
  assertSameOrigin,
  readJsonPayload,
  requireAdminAction,
} from './_shared';

// NOTE: 'use server' file は runtime 定数 export を許可しないため、
// runtime = 'edge' は呼び出し元 (page) 経由で設定される。

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

  const repo = await getSkillsRepo();
  const updated = await repo.update(parsed.data);
  revalidateTag('skills');
  return { ok: true, data: updated };
}
