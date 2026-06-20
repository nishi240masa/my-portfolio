import { unstable_cache } from 'next/cache';
import type { SkillsContent } from '@/types/skill';
import type { SingletonRepository } from '../types';
import { readJson, writeJson } from './jsonFile';

const FILE = 'skills.json';

export class JsonSkillsRepository implements SingletonRepository<SkillsContent> {
  async get(): Promise<SkillsContent> {
    return readJson<SkillsContent>(FILE);
  }

  async update(data: SkillsContent): Promise<SkillsContent> {
    await writeJson(FILE, data);
    return data;
  }
}

// unstable_cache でラップしたシングルトン取得 (revalidateTag('skills') で無効化)
export const getSkillsCached = unstable_cache(
  async (): Promise<SkillsContent> => readJson<SkillsContent>(FILE),
  ['skills'],
  { tags: ['skills'] },
);
