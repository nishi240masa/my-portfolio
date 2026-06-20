// リポジトリのファクトリ
// 環境変数 REPOSITORY_DRIVER で実装を切替（'json' (default) | 'github'）

import { unstable_cache } from 'next/cache';
import type { HomeContent } from '@/types/home';
import type { Profile } from '@/types/profile';
import type { SkillsContent } from '@/types/skill';
import type { Post, PostPage } from '@/types/post';
import { JsonProductionRepository } from './json/jsonProductionRepository';
import { JsonProfileRepository } from './json/jsonProfileRepository';
import { JsonSkillsRepository } from './json/jsonSkillsRepository';
import { JsonHomeRepository } from './json/jsonHomeRepository';
import { JsonArticleRepository } from './json/jsonArticleRepository';
import {
  GitHubHomeRepository,
  GitHubProductionRepository,
  GitHubProfileRepository,
  GitHubSkillsRepository,
  GitHubArticleRepository,
} from './github';

function assertGitHubEnv(): void {
  const missing: string[] = [];
  if (!process.env.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!process.env.GITHUB_OWNER) missing.push('GITHUB_OWNER');
  if (!process.env.GITHUB_REPO) missing.push('GITHUB_REPO');
  if (missing.length > 0) {
    throw new Error(
      `REPOSITORY_DRIVER=github is selected but required env vars are missing: ${missing.join(', ')}`,
    );
  }
}

// driver 解決時に 1 回だけ env を検証する（factory 毎に呼ぶ重複を排除）
const assertedDriver = (() => {
  const d = process.env.REPOSITORY_DRIVER ?? 'json';
  if (d === 'github') assertGitHubEnv();
  return d;
})();

function makeProductionRepo() {
  switch (assertedDriver) {
    case 'github':
      return new GitHubProductionRepository();
    case 'json':
    default:
      return new JsonProductionRepository();
  }
}

function makeProfileRepo() {
  switch (assertedDriver) {
    case 'github':
      return new GitHubProfileRepository();
    case 'json':
    default:
      return new JsonProfileRepository();
  }
}

function makeSkillsRepo() {
  switch (assertedDriver) {
    case 'github':
      return new GitHubSkillsRepository();
    case 'json':
    default:
      return new JsonSkillsRepository();
  }
}

function makeHomeRepo() {
  switch (assertedDriver) {
    case 'github':
      return new GitHubHomeRepository();
    case 'json':
    default:
      return new JsonHomeRepository();
  }
}

function makeArticleRepo() {
  switch (assertedDriver) {
    case 'github':
      return new GitHubArticleRepository();
    case 'json':
    default:
      return new JsonArticleRepository();
  }
}

export const productionRepo = makeProductionRepo();
export const profileRepo = makeProfileRepo();
export const skillsRepo = makeSkillsRepo();
export const homeRepo = makeHomeRepo();
export const articleRepo = makeArticleRepo();

// ---
// 公開ページ向けのキャッシュ済み getter
// driver が json でも github でも同じインタフェースで取得できるよう、
// repository インスタンスのメソッドを unstable_cache で包んで再エクスポートする。
// revalidateTag('home' | 'profile' | 'skills' | 'productions') で無効化する。
// ---

export const getHomeCached = unstable_cache(
  async (): Promise<HomeContent> => homeRepo.get(),
  ['home'],
  { tags: ['home'] },
);

export const getProfileCached = unstable_cache(
  async (): Promise<Profile> => profileRepo.get(),
  ['profile'],
  { tags: ['profile'] },
);

export const getSkillsCached = unstable_cache(
  async (): Promise<SkillsContent> => skillsRepo.get(),
  ['skills'],
  { tags: ['skills'] },
);

export const listProductionsCached = unstable_cache(
  async (): Promise<PostPage[]> => productionRepo.list(),
  ['productions', 'list'],
  { tags: ['productions'] },
);

export const listProductionsSummaryCached = unstable_cache(
  async (): Promise<Post[]> => productionRepo.listSummary(),
  ['productions', 'listSummary'],
  { tags: ['productions'] },
);

// 引数 id は unstable_cache が自動で keyParts に追加される
export const getProductionByIdCached = unstable_cache(
  async (id: number): Promise<PostPage | null> => productionRepo.getById(id),
  ['productions', 'byId'],
  // TODO(PR-8): per-id 粒度に変更 (tags: ['productions', `production:${id}`])
  { tags: ['productions'] },
);
