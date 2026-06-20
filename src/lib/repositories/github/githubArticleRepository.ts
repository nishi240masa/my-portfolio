import type { Article } from '@/lib/schemas/article';
import type { ArticleRepository } from '../articles';
import { readJsonWithMeta, writeJson } from './jsonGithubFile';

const FILE = 'articles.json';

export class GitHubArticleRepository implements ArticleRepository {
  async list(): Promise<Article[]> {
    const { data } = await readJsonWithMeta<Article[]>(FILE);
    return data;
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const all = await this.list();
    return all.find((a) => a.slug === slug) ?? null;
  }

  async create(data: Article): Promise<Article> {
    const { data: all, sha } = await readJsonWithMeta<Article[]>(FILE);
    if (all.some((a) => a.slug === data.slug)) {
      throw new Error(`Article slug already exists: ${data.slug}`);
    }
    await writeJson(FILE, [...all, data], sha, `chore(data): add article ${data.slug}`);
    return data;
  }

  async update(slug: string, data: Partial<Article>): Promise<Article> {
    const { data: all, sha } = await readJsonWithMeta<Article[]>(FILE);
    const idx = all.findIndex((a) => a.slug === slug);
    if (idx === -1) {
      throw new Error(`Article not found: ${slug}`);
    }
    const updated: Article = { ...all[idx], ...data, slug };
    const next = [...all];
    next[idx] = updated;
    await writeJson(FILE, next, sha, `chore(data): update article ${slug}`);
    return updated;
  }

  async delete(slug: string): Promise<void> {
    const { data: all, sha } = await readJsonWithMeta<Article[]>(FILE);
    const next = all.filter((a) => a.slug !== slug);
    if (next.length === all.length) {
      throw new Error(`Article not found: ${slug}`);
    }
    await writeJson(FILE, next, sha, `chore(data): delete article ${slug}`);
  }
}
