// Services (受託メニュー) のZodスキーマ — SSOT
// data/services.json の構造に従う。
import { z } from 'zod';

export const serviceItemSchema = z.object({
  kanji: z.string(),
  title: z.string(),
  description: z.string(),
  turnaround: z.string(),
  tags: z.array(z.string()).default([]),
});

export const servicesSchema = z.object({
  intro: z.string(),
  aiNote: z.string(),
  items: z.array(serviceItemSchema).default([]),
  turnaroundNote: z.string(),
  contactCta: z.string(),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;
