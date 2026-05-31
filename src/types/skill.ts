// スキルページのコンテンツ型
export interface SkillItem {
  name: string;
  level: number;
  years: string;
  note?: string;
}

export interface SkillCategory {
  kanji: string;
  en: string;
  items: SkillItem[];
}

export interface Certification {
  name: string;
  year: string;
  org: string;
}

export interface SkillsContent {
  intro: string;
  categories: SkillCategory[];
  tools: string[];
  certifications: Certification[];
}
