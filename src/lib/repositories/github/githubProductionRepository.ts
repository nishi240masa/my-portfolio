import type { Post, PostPage } from '@/types/post';
import type { CollectionRepository } from '../types';
import { readJsonWithMeta, writeJson } from './jsonGithubFile';

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

export class GitHubProductionRepository implements CollectionRepository<PostPage> {
  async list(): Promise<PostPage[]> {
    const { data } = await readJsonWithMeta<PostPage[]>(FILE);
    return data;
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
    const { data: all, sha } = await readJsonWithMeta<PostPage[]>(FILE);
    const ids = all.map((p) => p.id);
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const created: PostPage = { ...data, id: nextId };
    await writeJson(FILE, [...all, created], sha, `chore(data): add production #${nextId}`);
    return created;
  }

  async update(id: number, data: Partial<Omit<PostPage, 'id'>>): Promise<PostPage> {
    const { data: all, sha } = await readJsonWithMeta<PostPage[]>(FILE);
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Production not found: ${id}`);
    }
    const updated: PostPage = { ...all[idx], ...data, id };
    const next = [...all];
    next[idx] = updated;
    await writeJson(FILE, next, sha, `chore(data): update production #${id}`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const { data: all, sha } = await readJsonWithMeta<PostPage[]>(FILE);
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) {
      throw new Error(`Production not found: ${id}`);
    }
    await writeJson(FILE, next, sha, `chore(data): delete production #${id}`);
  }
}
