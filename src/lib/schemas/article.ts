// Article (記事) のZodスキーマ — SSOT
// data/articles.json の構造に従う。
// /articles で公開される自作記事を扱う。
import { z } from 'zod';

export const articleSchema = z.object({
  slug: z.string().min(1, 'slug は必須です'),
  title: z.string().min(1, 'タイトルは必須です'),
  publishedAt: z.string().min(1, '公開日は必須です'),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  body: z.string().default(''),
});

export type Article = z.infer<typeof articleSchema>;
