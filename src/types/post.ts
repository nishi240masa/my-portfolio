// 記事の型
export interface Post {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  tags: string[];
}

// ページの型
export interface PostPage {
  id: number;
  title: string;
  image: string;
  peopleNum: number;
  role: string;
  period: string;
  technologys: string[];
  description: string;
  date: string;
  tags: string[];
  content: string;
}
