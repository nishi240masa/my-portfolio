import { unstable_cache } from 'next/cache';
import type { Profile } from '@/types/profile';
import type { SingletonRepository } from '../types';
import { readJson, writeJson } from './jsonFile';

const FILE = 'profile.json';

export class JsonProfileRepository implements SingletonRepository<Profile> {
  async get(): Promise<Profile> {
    return readJson<Profile>(FILE);
  }

  async update(data: Profile): Promise<Profile> {
    await writeJson(FILE, data);
    return data;
  }
}

// unstable_cache でラップしたシングルトン取得 (revalidateTag('profile') で無効化)
export const getProfileCached = unstable_cache(
  async (): Promise<Profile> => readJson<Profile>(FILE),
  ['profile'],
  { tags: ['profile'] },
);
