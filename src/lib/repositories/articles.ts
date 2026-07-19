// Article 用のリポジトリインタフェース定義
// slug をキーとする読み取り中心の集約。
// 書き込みは将来 admin から行えるよう create/update/delete のシグネチャを用意する。

import type { Article } from '@/lib/schemas/article';

export interface ArticleRepository {
  list(): Promise<Article[]>;
  getBySlug(slug: string): Promise<Article | null>;
  create(data: Article): Promise<Article>;
  update(slug: string, data: Partial<Article>): Promise<Article>;
  delete(slug: string): Promise<void>;
}
