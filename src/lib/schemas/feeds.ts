// data/feeds.json 用のスキーマ。
// 外部サービス (Zenn / Qiita / GitHub) のスナップショットを保持する。
// scripts/fetch-feeds.mjs と /journal が共有する SSOT。
import { z } from 'zod';

export const feedItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  publishedAt: z.string().nullable().optional(),
  source: z.string(),
  summary: z.string().optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.null()])).optional(),
});

export const feedsSchema = z.object({
  zenn: z.array(feedItemSchema).default([]),
  qiita: z.array(feedItemSchema).default([]),
  github: z.array(feedItemSchema).default([]),
  updatedAt: z.string().nullable().default(null),
});

export type FeedItem = z.infer<typeof feedItemSchema>;
export type Feeds = z.infer<typeof feedsSchema>;
