// 管理 API のリクエスト Zod スキーマ
import { z } from 'zod';

export const productionSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  image: z.string().optional(),
  description: z.string().min(1, '説明は必須です'),
  date: z.string().min(1, '日付は必須です'),
  tags: z.array(z.string()),
  peopleNum: z.number().int().nonnegative(),
  role: z.string(),
  period: z.string(),
  technologys: z.array(z.string()),
  content: z.string(),
});

export const profileSchema = z.object({
  nameJp: z.string(),
  nameEn: z.string(),
  nickname: z.string(),
  portraitSrc: z.string(),
  headline: z.string(),
  bioParagraphs: z.array(z.string()),
  education: z.array(z.object({ year: z.string(), label: z.string(), note: z.string() })),
  experience: z.array(z.object({ year: z.string(), label: z.string(), note: z.string() })),
  interests: z.array(z.string()),
  sns: z.array(z.object({ label: z.string(), handle: z.string(), url: z.string() })),
  closingLeft: z.string(),
  closingRight: z.string(),
});

export const skillsSchema = z.object({
  intro: z.string(),
  categories: z.array(
    z.object({
      kanji: z.string(),
      en: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          level: z.number().min(0).max(100),
          years: z.string(),
          note: z.string().optional(),
        }),
      ),
    }),
  ),
  tools: z.array(z.string()),
  certifications: z.array(z.object({ name: z.string(), year: z.string(), org: z.string() })),
});

export const homeSchema = z.object({
  nameJp: z.string(),
  nameEn: z.string(),
  portraitSrc: z.string(),
  heroLeft: z.string(),
  heroRight: z.string(),
  metaLines: z.array(z.string()),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  mottoEyebrow: z.string(),
  mottoTitle: z.string(),
  mottoBody: z.string(),
  indexItems: z.array(
    z.object({ href: z.string(), n: z.string(), en: z.string(), jp: z.string(), desc: z.string() }),
  ),
});
