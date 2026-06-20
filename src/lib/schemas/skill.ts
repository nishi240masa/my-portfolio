// Skill (技能) のZodスキーマ — SSOT
// data/skills.json の構造に従う。
import { z } from 'zod';

export const skillItemSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
  years: z.string(),
  note: z.string().optional(),
});

export const skillCategorySchema = z.object({
  kanji: z.string(),
  en: z.string(),
  items: z.array(skillItemSchema).default([]),
});

export const certificationSchema = z.object({
  name: z.string(),
  year: z.string(),
  org: z.string(),
});

export const skillsSchema = z.object({
  intro: z.string(),
  categories: z.array(skillCategorySchema).default([]),
  tools: z.array(z.string()).default([]),
  certifications: z.array(certificationSchema).default([]),
});

export type SkillItem = z.infer<typeof skillItemSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type SkillsContent = z.infer<typeof skillsSchema>;
