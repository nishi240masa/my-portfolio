// !!! dev/test 専用 — production (edge runtime) では使用不可 !!!
// production deploy では REPOSITORY_DRIVER=github を強制し、github driver を使うこと。
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
