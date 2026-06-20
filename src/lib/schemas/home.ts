// Home (ホーム) のZodスキーマ — SSOT
// data/home.json の構造に従う。
import { z } from 'zod';

export const homeIndexItemSchema = z.object({
  href: z.string(),
  n: z.string(),
  en: z.string(),
  jp: z.string(),
  desc: z.string(),
});

export const homeSchema = z.object({
  nameJp: z.string(),
  nameEn: z.string(),
  portraitSrc: z.string(),
  heroLeft: z.string(),
  heroRight: z.string(),
  metaLines: z.array(z.string()).default([]),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  mottoEyebrow: z.string(),
  mottoTitle: z.string(),
  mottoBody: z.string(),
  indexItems: z.array(homeIndexItemSchema).default([]),
});

export type HomeIndexItem = z.infer<typeof homeIndexItemSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
