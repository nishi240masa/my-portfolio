import type { SkillsContent } from '@/types/skill';
import type { SingletonRepository } from '../types';
import { readJsonWithMeta, writeJson } from './jsonGithubFile';

const FILE = 'skills.json';

export class GitHubSkillsRepository implements SingletonRepository<SkillsContent> {
  async get(): Promise<SkillsContent> {
    const { data } = await readJsonWithMeta<SkillsContent>(FILE);
    return data;
  }

  async update(data: SkillsContent): Promise<SkillsContent> {
    const { sha } = await readJsonWithMeta<SkillsContent>(FILE);
    await writeJson(FILE, data, sha, `chore(data): update ${FILE} via admin`);
    return data;
  }
}
