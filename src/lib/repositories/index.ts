// リポジトリのファクトリ
// 環境変数 REPOSITORY_DRIVER で実装を切替（'json' (default) | 'github'）

import { JsonProductionRepository } from './json/jsonProductionRepository';
import { JsonProfileRepository } from './json/jsonProfileRepository';
import { JsonSkillsRepository } from './json/jsonSkillsRepository';
import { JsonHomeRepository } from './json/jsonHomeRepository';
import {
  GitHubHomeRepository,
  GitHubProductionRepository,
  GitHubProfileRepository,
  GitHubSkillsRepository,
} from './github';

const driver = process.env.REPOSITORY_DRIVER ?? 'json';

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

function makeProductionRepo() {
  switch (driver) {
    case 'github':
      assertGitHubEnv();
      return new GitHubProductionRepository();
    case 'json':
    default:
      return new JsonProductionRepository();
  }
}

function makeProfileRepo() {
  switch (driver) {
    case 'github':
      assertGitHubEnv();
      return new GitHubProfileRepository();
    case 'json':
    default:
      return new JsonProfileRepository();
  }
}

function makeSkillsRepo() {
  switch (driver) {
    case 'github':
      assertGitHubEnv();
      return new GitHubSkillsRepository();
    case 'json':
    default:
      return new JsonSkillsRepository();
  }
}

function makeHomeRepo() {
  switch (driver) {
    case 'github':
      assertGitHubEnv();
      return new GitHubHomeRepository();
    case 'json':
    default:
      return new JsonHomeRepository();
  }
}

export const productionRepo = makeProductionRepo();
export const profileRepo = makeProfileRepo();
export const skillsRepo = makeSkillsRepo();
export const homeRepo = makeHomeRepo();
