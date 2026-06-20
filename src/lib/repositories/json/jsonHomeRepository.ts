import { unstable_cache } from 'next/cache';
import type { HomeContent } from '@/types/home';
import type { SingletonRepository } from '../types';
import { readJson, writeJson } from './jsonFile';

const FILE = 'home.json';

export class JsonHomeRepository implements SingletonRepository<HomeContent> {
  async get(): Promise<HomeContent> {
    return readJson<HomeContent>(FILE);
  }

  async update(data: HomeContent): Promise<HomeContent> {
    await writeJson(FILE, data);
    return data;
  }
}

// unstable_cache でラップしたシングルトン取得 (revalidateTag('home') で無効化)
export const getHomeCached = unstable_cache(
  async (): Promise<HomeContent> => readJson<HomeContent>(FILE),
  ['home'],
  { tags: ['home'] },
);
