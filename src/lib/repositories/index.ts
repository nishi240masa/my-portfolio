// リポジトリの async factories + cached wrappers (edge 互換)
//
// このファイルは driver 実装 (json / github) への eager static import を
// **一切持たない**。本ファイルを import するだけで json driver の `node:fs`
// 依存をバンドルに引き込まないことを保証する。
//
// 物理分割の意図:
// - 同一ファイル top-level に static `import { JsonXxx }` と factory 内
//   `await import('./json/...')` が共存すると、webpack は dynamic import を
//   static 側に寄せて bundle してしまうことが知られている (chunk 分割せず
//   inlineされる)。結果として edge bundle に json driver が混入し続ける。
// - そのため、sync exports と eager imports は `./sync` に物理的に分離した。
// - 公開ページ (CF Pages edge runtime) では本ファイルの cached wrapper /
//   async factory のみを使うこと。admin / api / sitemap など node runtime
//   consumer は `./sync` から sync export を使ってよい。
//
// driver 切替: 環境変数 REPOSITORY_DRIVER ('json' (default) | 'github')
// revalidation: revalidateTag('home' | 'profile' | 'skills' | 'productions')
//   per-id 失効は revalidateTag(`production:${id}`) を使う。

import { unstable_cache } from 'next/cache';
import type { HomeContent } from '@/types/home';
import type { Profile } from '@/types/profile';
import type { SkillsContent } from '@/types/skill';
import type { Post, PostPage } from '@/types/post';
import type { CollectionRepository, SingletonRepository } from './types';

// Production リポジトリだけは listSummary も提供する（json/github 双方で実装済み）。
// types.ts への追加は scope 外なので、本ファイル内で interface を合成する。
type ProductionRepository = CollectionRepository<PostPage> & {
  listSummary(): Promise<Post[]>;
};

export type { HomeContent } from '@/types/home';
export type { Profile } from '@/types/profile';
export type { SkillsContent } from '@/types/skill';
export type { Post, PostPage } from '@/types/post';
export type { CollectionRepository, SingletonRepository } from './types';

// === driver 解決 ========================================================
// 各 async factory 内で都度評価する。env 検証 (assertGitHubEnv) は最初の
// 呼び出し時 1 回だけ走るよう module-local の lazy flag で制御する。
// module load 時の副作用 (top-level IIFE での env throw) を避け、テスト時
// にも安全に import できるようにする。

let envAsserted = false;
function ensureEnvForDriver(driver: string): void {
  if (envAsserted) return;
  if (driver === 'github') {
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
  envAsserted = true;
}

function resolveDriver(): string {
  return process.env.REPOSITORY_DRIVER ?? 'json';
}

// === ASYNC factories (edge-compatible) ===================================
// dynamic import により、呼び出し側の edge bundle に json/github driver の
// static dep が含まれない (webpack が真の lazy chunk として扱う)。

export async function getHomeRepo(): Promise<SingletonRepository<HomeContent>> {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubHomeRepository');
    return new m.GitHubHomeRepository();
  }
  const m = await import('./json/jsonHomeRepository');
  return new m.JsonHomeRepository();
}

export async function getProfileRepo(): Promise<SingletonRepository<Profile>> {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubProfileRepository');
    return new m.GitHubProfileRepository();
  }
  const m = await import('./json/jsonProfileRepository');
  return new m.JsonProfileRepository();
}

export async function getSkillsRepo(): Promise<SingletonRepository<SkillsContent>> {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubSkillsRepository');
    return new m.GitHubSkillsRepository();
  }
  const m = await import('./json/jsonSkillsRepository');
  return new m.JsonSkillsRepository();
}

export async function getProductionRepo(): Promise<ProductionRepository> {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubProductionRepository');
    return new m.GitHubProductionRepository();
  }
  const m = await import('./json/jsonProductionRepository');
  return new m.JsonProductionRepository();
}

export async function getArticleRepo() {
  const driver = resolveDriver();
  ensureEnvForDriver(driver);
  if (driver === 'github') {
    const m = await import('./github/githubArticleRepository');
    return new m.GitHubArticleRepository();
  }
  const m = await import('./json/jsonArticleRepository');
  return new m.JsonArticleRepository();
}

// === cached wrappers =====================================================
// driver が json でも github でも同じインタフェースで取得できるよう、
// async factory のメソッドを unstable_cache で包んで再エクスポートする。
// 内部で async factory を使うことで、cached wrapper を import するページの
// edge bundle に json driver の static dep を引き込まない。

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
