// プロフィールページのコンテンツ型
export interface TimelineItem {
  year: string;
  label: string;
  note: string;
}

export interface SnsLink {
  label: string;
  handle: string;
  url: string;
}

export interface Profile {
  nameJp: string;
  nameEn: string;
  nickname: string;
  portraitSrc: string;
  headline: string;
  bioParagraphs: string[];
  education: TimelineItem[];
  experience: TimelineItem[];
  interests: string[];
  sns: SnsLink[];
  closingLeft: string;
  closingRight: string;
}
