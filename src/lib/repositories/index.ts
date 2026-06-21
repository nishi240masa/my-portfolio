// リポジトリのファクトリ
// 環境変数 REPOSITORY_DRIVER で実装を切替（'json' (default) | 'github'）
//
// 構造:
// - sync exports (legacy): admin/api ルート / layout / sitemap 等 node runtime 専用 consumer 向け。
//   eager import なので import するだけで json driver (node:fs) が bundle 入りする。
// - async factories (NEW): 呼び出し側の bundle に json driver の static dep を引き込まない。
//   edge runtime 化したいルートはこちら経由を使う。
// - cached wrappers (unstable_cache): 内部で async factory を使うため、これを import する
//   公開ページの edge bundle には json driver の static dep が含まれない。

import { unstable_cache } from 'next/cache';
import type { HomeContent } from '@/types/home';
import type { Profile } from '@/types/profile';
import type { SkillsContent } from '@/types/skill';
import type { Post, PostPage } from '@/types/post';
import type { CollectionRepository, SingletonRepository } from './types';
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

// Production リポジトリだけは listSummary も提供する（json/github 双方で実装済み）。
// types.ts への追加は scope 外なので、本ファイル内で interface を合成する。
type ProductionRepository = CollectionRepository<PostPage> & {
  listSummary(): Promise<Post[]>;
};

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

// === SYNC factories (legacy) ============================================
// admin/api ルート（node runtime）と layout / sitemap が依然これを使う。
// Phase 2c で async factory 経由に migrate 予定。

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

/** @deprecated edge 互換が必要な consumer は `getProductionRepo()` を使うこと */
export const productionRepo = makeProductionRepo();
/** @deprecated edge 互換が必要な consumer は `getProfileRepo()` を使うこと */
export const profileRepo = makeProfileRepo();
/** @deprecated edge 互換が必要な consumer は `getSkillsRepo()` を使うこと */
export const skillsRepo = makeSkillsRepo();
/** @deprecated edge 互換が必要な consumer は `getHomeRepo()` を使うこと */
export const homeRepo = makeHomeRepo();
/** @deprecated edge 互換が必要な consumer は `getArticleRepo()` を使うこと */
export const articleRepo = makeArticleRepo();

// === ASYNC factories (edge-compatible) ===================================
// dynamic import により、呼び出し側の edge bundle に json/github driver の static
// dep が含まれない（必要時に lazy load される）。
// driver 解決は eager に済ませた `assertedDriver` を再利用。

export async function getHomeRepo(): Promise<SingletonRepository<HomeContent>> {
  if (assertedDriver === 'github') {
    const m = await import('./github/githubHomeRepository');
    return new m.GitHubHomeRepository();
  }
  const m = await import('./json/jsonHomeRepository');
  return new m.JsonHomeRepository();
}

export async function getProfileRepo(): Promise<SingletonRepository<Profile>> {
  if (assertedDriver === 'github') {
    const m = await import('./github/githubProfileRepository');
    return new m.GitHubProfileRepository();
  }
  const m = await import('./json/jsonProfileRepository');
  return new m.JsonProfileRepository();
}

export async function getSkillsRepo(): Promise<SingletonRepository<SkillsContent>> {
  if (assertedDriver === 'github') {
    const m = await import('./github/githubSkillsRepository');
    return new m.GitHubSkillsRepository();
  }
  const m = await import('./json/jsonSkillsRepository');
  return new m.JsonSkillsRepository();
}

export async function getProductionRepo(): Promise<ProductionRepository> {
  if (assertedDriver === 'github') {
    const m = await import('./github/githubProductionRepository');
    return new m.GitHubProductionRepository();
  }
  const m = await import('./json/jsonProductionRepository');
  return new m.JsonProductionRepository();
}

// ---
// 公開ページ向けのキャッシュ済み getter
// driver が json でも github でも同じインタフェースで取得できるよう、
// async factory のメソッドを unstable_cache で包んで再エクスポートする。
// revalidateTag('home' | 'profile' | 'skills' | 'productions') で無効化する。
//
// 内部で async factory を使うことで、cached wrapper を import するページの
// edge bundle に json driver の static dep を引き込まない。
// ---

export const getHomeCached = unstable_cache(
  async (): Promise<HomeContent> => {
    const repo = await getHomeRepo();
    return repo.get();
  },
  ['home'],
  { tags: ['home'] },
);

export const getProfileCached = unstable_cache(
  async (): Promise<Profile> => {
    const repo = await getProfileRepo();
    return repo.get();
  },
  ['profile'],
  { tags: ['profile'] },
);

export const getSkillsCached = unstable_cache(
  async (): Promise<SkillsContent> => {
    const repo = await getSkillsRepo();
    return repo.get();
  },
  ['skills'],
  { tags: ['skills'] },
);

export const listProductionsCached = unstable_cache(
  async (): Promise<PostPage[]> => {
    const repo = await getProductionRepo();
    return repo.list();
  },
  ['productions', 'list'],
  { tags: ['productions'] },
);

export const listProductionsSummaryCached = unstable_cache(
  async (): Promise<Post[]> => {
    const repo = await getProductionRepo();
    return repo.listSummary();
  },
  ['productions', 'listSummary'],
  { tags: ['productions'] },
);

// per-id 粒度の cache: 個別 id の更新で他の id を失効させないため、
// id ごとに unstable_cache を組み立てて呼び出す wrapper を提供する。
// revalidateTag('productions') で全件失効、revalidateTag(`production:${id}`) で個別失効。
export const getProductionByIdCached = (id: number): Promise<PostPage | null> =>
  unstable_cache(
    async (): Promise<PostPage | null> => {
      const repo = await getProductionRepo();
      return repo.getById(id);
    },
    ['productions', 'byId', String(id)],
    { tags: ['productions', `production:${id}`] },
  )();
