// !!! dev/test 専用 — production (edge runtime) では使用不可 !!!
// production deploy では REPOSITORY_DRIVER=github を強制し、github driver を使うこと。
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
