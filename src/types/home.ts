// ホームページのコンテンツ型
export interface HomeIndexItem {
  href: string;
  n: string;
  en: string;
  jp: string;
  desc: string;
}

export interface HomeContent {
  nameJp: string;
  nameEn: string;
  portraitSrc: string;
  heroLeft: string;
  heroRight: string;
  metaLines: string[];
  ctaLabel: string;
  ctaHref: string;
  mottoEyebrow: string;
  mottoTitle: string;
  mottoBody: string;
  indexItems: HomeIndexItem[];
}
