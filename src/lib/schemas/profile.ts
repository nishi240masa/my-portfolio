// Profile (人物像) のZodスキーマ — SSOT
// data/profile.json の構造に従う。
import { z } from 'zod';

export const timelineItemSchema = z.object({
  year: z.string(),
  label: z.string(),
  note: z.string(),
});

// 既存 data/profile.json は { label, handle, url } の構造で、API routes と
// repository も同じ形に依存しているため、後方互換のためここでも踏襲する。
// url は実値かもしくは空文字（未設定）の双方を許容する。
export const snsLinkSchema = z.object({
  label: z.string(),
  handle: z.string(),
  url: z.string().url().or(z.literal('')),
});

export const profileSchema = z.object({
  nameJp: z.string(),
  nameEn: z.string(),
  nickname: z.string(),
  portraitSrc: z.string(),
  headline: z.string(),
  bioParagraphs: z.array(z.string()).default([]),
  education: z.array(timelineItemSchema).default([]),
  experience: z.array(timelineItemSchema).default([]),
  interests: z.array(z.string()).default([]),
  sns: z.array(snsLinkSchema).default([]),
  closingLeft: z.string(),
  closingRight: z.string(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type SnsLink = z.infer<typeof snsLinkSchema>;
export type Profile = z.infer<typeof profileSchema>;
