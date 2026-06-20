// i18n サブセット読み込みユーティリティ
// - /en ランディング専用の最小実装
// - 既存 repositories とは独立（ja は repositories 経由のまま）

import { promises as fs } from 'node:fs';
import path from 'node:path';

export type LandingEn = {
  hero: {
    name: string;
    alias: string;
    headline: string;
    tagline: string;
  };
  role: {
    title: string;
    summary: string;
    lookingFor: string;
  };
  skills: Array<{
    category: string;
    items: string[];
  }>;
  contact: {
    intro: string;
    links: Array<{
      label: string;
      handle: string;
      url: string;
    }>;
  };
  note: string;
};

const EN_DATA_DIR = path.join(process.cwd(), 'data', 'en');

export async function getLandingEn(): Promise<LandingEn> {
  const filePath = path.join(EN_DATA_DIR, 'landing.json');
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text) as LandingEn;
}
