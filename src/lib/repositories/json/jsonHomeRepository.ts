// !!! dev/test 専用 — production (edge runtime) では使用不可 !!!
// production deploy では REPOSITORY_DRIVER=github を強制し、github driver を使うこと。
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
