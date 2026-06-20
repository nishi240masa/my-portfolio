import type { Profile } from '@/types/profile';
import type { SingletonRepository } from '../types';
import { readJsonWithMeta, writeJson } from './jsonGithubFile';

const FILE = 'profile.json';

export class GitHubProfileRepository implements SingletonRepository<Profile> {
  async get(): Promise<Profile> {
    const { data } = await readJsonWithMeta<Profile>(FILE);
    return data;
  }

  async update(data: Profile): Promise<Profile> {
    const { sha } = await readJsonWithMeta<Profile>(FILE);
    await writeJson(FILE, data, sha, `chore(data): update ${FILE} via admin`);
    return data;
  }
}
