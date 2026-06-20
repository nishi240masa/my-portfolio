import { unstable_cache } from 'next/cache';
import type { Post, PostPage } from '@/types/post';
import type { CollectionRepository } from '../types';
import { readJson, writeJson } from './jsonFile';

const FILE = 'productions.json';

function toListItem(p: PostPage): Post {
  return {
    id: p.id,
    title: p.title,
    image: p.image,
    description: p.description,
    date: p.date,
    tags: p.tags,
  };
}

export class JsonProductionRepository implements CollectionRepository<PostPage> {
  async list(): Promise<PostPage[]> {
    return readJson<PostPage[]>(FILE);
  }

  async listSummary(): Promise<Post[]> {
    const all = await this.list();
    return all.map(toListItem);
  }

  async getById(id: number): Promise<PostPage | null> {
    const all = await this.list();
    return all.find((p) => p.id === id) ?? null;
  }

  async create(data: Omit<PostPage, 'id'>): Promise<PostPage> {
    const all = await this.list();
    const nextId = all.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const created: PostPage = { ...data, id: nextId };
    await writeJson(FILE, [...all, created]);
    return created;
  }

  async update(id: number, data: Partial<Omit<PostPage, 'id'>>): Promise<PostPage> {
    const all = await this.list();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Production not found: ${id}`);
    }
    const updated: PostPage = { ...all[idx], ...data, id };
    const next = [...all];
    next[idx] = updated;
    await writeJson(FILE, next);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const all = await this.list();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) {
      throw new Error(`Production not found: ${id}`);
    }
    await writeJson(FILE, next);
  }
}

// unstable_cache でラップした取得関数 (revalidateTag('productions') で無効化)
export const listProductionsCached = unstable_cache(
  async (): Promise<PostPage[]> => readJson<PostPage[]>(FILE),
  ['productions', 'list'],
  { tags: ['productions'] },
);

export const listProductionsSummaryCached = unstable_cache(
  async (): Promise<Post[]> => {
    const all = await readJson<PostPage[]>(FILE);
    return all.map(toListItem);
  },
  ['productions', 'listSummary'],
  { tags: ['productions'] },
);

export const getProductionByIdCached = unstable_cache(
  async (id: number): Promise<PostPage | null> => {
    const all = await readJson<PostPage[]>(FILE);
    return all.find((p) => p.id === id) ?? null;
  },
  ['productions', 'byId'],
  { tags: ['productions'] },
);
