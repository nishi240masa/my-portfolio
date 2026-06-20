import type { HomeContent } from '@/types/home';
import type { SingletonRepository } from '../types';
import { readJsonWithMeta, writeJson } from './jsonGithubFile';

const FILE = 'home.json';

export class GitHubHomeRepository implements SingletonRepository<HomeContent> {
  async get(): Promise<HomeContent> {
    const { data } = await readJsonWithMeta<HomeContent>(FILE);
    return data;
  }

  async update(data: HomeContent): Promise<HomeContent> {
    // 既存 sha を取得して conflict を避ける
    const { sha } = await readJsonWithMeta<HomeContent>(FILE);
    await writeJson(FILE, data, sha, `chore(data): update ${FILE} via admin`);
    return data;
  }
}
