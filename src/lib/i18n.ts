// i18n サブセット読み込みユーティリティ
// - /en ランディング専用の最小実装
// - 既存 repositories とは独立（ja は repositories 経由のまま）
// - edge runtime 互換のため、static import で landing.json を取り込む
//   （node:fs を避けることで CF Pages edge function でも動作する）

import landingEnData from '../../data/en/landing.json';

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

export async function getLandingEn(): Promise<LandingEn> {
  return landingEnData as LandingEn;
}
