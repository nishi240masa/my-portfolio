// リポジトリのファクトリ
// 環境変数 REPOSITORY_DRIVER で実装を切替（現状は 'json' のみ。将来 'db' を追加）

import { JsonProductionRepository } from './json/jsonProductionRepository';
import { JsonProfileRepository } from './json/jsonProfileRepository';
import { JsonSkillsRepository } from './json/jsonSkillsRepository';
import { JsonHomeRepository } from './json/jsonHomeRepository';

const driver = process.env.REPOSITORY_DRIVER ?? 'json';

function makeProductionRepo() {
  switch (driver) {
    case 'json':
    default:
      return new JsonProductionRepository();
  }
}

function makeProfileRepo() {
  switch (driver) {
    case 'json':
    default:
      return new JsonProfileRepository();
  }
}

function makeSkillsRepo() {
  switch (driver) {
    case 'json':
    default:
      return new JsonSkillsRepository();
  }
}

function makeHomeRepo() {
  switch (driver) {
    case 'json':
    default:
      return new JsonHomeRepository();
  }
}

export const productionRepo = makeProductionRepo();
export const profileRepo = makeProfileRepo();
export const skillsRepo = makeSkillsRepo();
export const homeRepo = makeHomeRepo();
