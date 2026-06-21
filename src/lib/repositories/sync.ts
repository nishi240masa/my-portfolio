// リポジトリの sync exports (legacy / node runtime 専用)
//
// このファイルは driver 実装 (json / github) を eager static import する。
// import するだけで json driver (`node:fs` 依存) がバンドルに乗るため、
// admin / api / layout / sitemap など node runtime で動く consumer 専用。
//
// edge runtime 互換が必要な consumer は、必ず `./index` の async factory
// (`getHomeRepo` 等) もしくは cached wrapper (`getHomeCached` 等) を使うこと。
//
// 物理分割の意図:
// - `./index.ts` から static `import { JsonXxx }` を完全に排除して webpack に
//   「json/github driver は lazy chunk」と確実に認識させる。
// - 同一ファイル top-level に static import と `await import()` を共存させると
//   webpack が dynamic を static 側に寄せてしまい lazy import が無効化される
//   ことがあるため、ファイル自体を分けることでこの最適化を物理的に防ぐ。

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

function makeProductionRepo(): ProductionRepository {
  switch (assertedDriver) {
    case 'github':
      return new GitHubProductionRepository();
    case 'json':
    default:
      return new JsonProductionRepository();
  }
}

function makeProfileRepo(): SingletonRepository<Profile> {
  switch (assertedDriver) {
    case 'github':
      return new GitHubProfileRepository();
    case 'json':
    default:
      return new JsonProfileRepository();
  }
}

function makeSkillsRepo(): SingletonRepository<SkillsContent> {
  switch (assertedDriver) {
    case 'github':
      return new GitHubSkillsRepository();
    case 'json':
    default:
      return new JsonSkillsRepository();
  }
}

function makeHomeRepo(): SingletonRepository<HomeContent> {
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
