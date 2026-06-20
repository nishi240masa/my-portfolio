import type { Article } from '@/lib/schemas/article';
import type { ArticleRepository } from '../articles';
import { readJson, writeJson } from './jsonFile';

const FILE = 'articles.json';

export class JsonArticleRepository implements ArticleRepository {
  async list(): Promise<Article[]> {
    return readJson<Article[]>(FILE);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const all = await this.list();
    return all.find((a) => a.slug === slug) ?? null;
  }

  async create(data: Article): Promise<Article> {
    const all = await this.list();
    if (all.some((a) => a.slug === data.slug)) {
      throw new Error(`Article slug already exists: ${data.slug}`);
    }
    await writeJson(FILE, [...all, data]);
    return data;
  }

  async update(slug: string, data: Partial<Article>): Promise<Article> {
    const all = await this.list();
    const idx = all.findIndex((a) => a.slug === slug);
    if (idx === -1) {
      throw new Error(`Article not found: ${slug}`);
    }
    const updated: Article = { ...all[idx], ...data, slug };
    const next = [...all];
    next[idx] = updated;
    await writeJson(FILE, next);
    return updated;
  }

  async delete(slug: string): Promise<void> {
    const all = await this.list();
    const next = all.filter((a) => a.slug !== slug);
    if (next.length === all.length) {
      throw new Error(`Article not found: ${slug}`);
    }
    await writeJson(FILE, next);
  }
}
