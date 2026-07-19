/**
 * src/lib/repositories/index.ts の edge guard 回帰テスト
 *
 * `assertEdgeCompat(driver)` の挙動を 3 ケース × 5 factory で網羅する:
 *   1. node + json driver        -> throw しない (通常 dev path)
 *   2. edge + json driver        -> 5 factory が Error を throw (fail-fast)
 *   3. edge + github driver (env 揃え) -> throw しない
 *
 * 仕様 SSOT: `.claude/tickets/test-repositories-edge-guard.md`
 *
 * 注意:
 * - `index.ts` には module-local の `envAsserted` flag があるため、
 *   テスト間で再 require して state をリセットする。
 * - `process.env` は beforeEach で snapshot し afterEach で restore する。
 * - github driver 経路では TOKEN/OWNER/REPO の dummy 値が必要 (env 検証で
 *   throw されてしまうのを避けるため)。
 */

// `next/cache` の `unstable_cache` は `@opentelemetry/api` を経由して読み込まれ、
// jest 環境ではそれが解決できずに module load 自体が失敗する。
// 本テストは `assertEdgeCompat` の挙動を検証するもので cache 自体は対象外なので、
// 同名の identity wrapper にスタブしておく。
jest.mock('next/cache', () => ({
  unstable_cache:
    <Args extends unknown[], R>(fn: (...args: Args) => R) =>
    (...args: Args): R =>
      fn(...args),
  revalidateTag: jest.fn(),
}));

type RepositoriesModule = typeof import('../index');

const FACTORY_NAMES = [
  'getHomeRepo',
  'getProfileRepo',
  'getSkillsRepo',
  'getProductionRepo',
  'getArticleRepo',
] as const;
type FactoryName = (typeof FACTORY_NAMES)[number];

/**
 * `index.ts` を毎回 fresh に require して `envAsserted` flag を初期化する。
 * jest.isolateModules を使うと module cache を分離できる。
 */
function loadRepositoriesFresh(): RepositoriesModule {
  let mod!: RepositoriesModule;
  jest.isolateModules(() => {
    mod = jest.requireActual<RepositoriesModule>('../index');
  });
  return mod;
}

describe('repositories index — assertEdgeCompat regression', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // 毎回クリーンな env から開始する
    process.env = { ...originalEnv };
    delete process.env.NEXT_RUNTIME;
    delete process.env.REPOSITORY_DRIVER;
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_OWNER;
    delete process.env.GITHUB_REPO;
    delete process.env.GITHUB_BRANCH;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('case 1: node runtime + REPOSITORY_DRIVER=json', () => {
    beforeEach(() => {
      // NEXT_RUNTIME 未設定 (node) + json driver は通常の dev 経路
      process.env.REPOSITORY_DRIVER = 'json';
    });

    it.each(FACTORY_NAMES)('%s does not throw', async (name: FactoryName) => {
      const mod = loadRepositoriesFresh();
      // resolve できれば throw していない
      await expect(mod[name]()).resolves.toBeDefined();
    });
  });

  describe('case 2: edge runtime + REPOSITORY_DRIVER=json', () => {
    beforeEach(() => {
      process.env.NEXT_RUNTIME = 'edge';
      process.env.REPOSITORY_DRIVER = 'json';
    });

    it.each(FACTORY_NAMES)(
      '%s throws an Error pointing to driver mis-configuration',
      async (name: FactoryName) => {
        const mod = loadRepositoriesFresh();
        await expect(mod[name]()).rejects.toThrow(/not edge-compatible/);
        await expect(mod[name]()).rejects.toThrow(/REPOSITORY_DRIVER=github/);
      },
    );
  });

  describe('case 3: edge runtime + REPOSITORY_DRIVER=github (env 揃え)', () => {
    beforeEach(() => {
      process.env.NEXT_RUNTIME = 'edge';
      process.env.REPOSITORY_DRIVER = 'github';
      // assertGitHubEnv が throw しないように dummy を入れる
      process.env.GITHUB_TOKEN = 'dummy-token';
      process.env.GITHUB_OWNER = 'dummy-owner';
      process.env.GITHUB_REPO = 'dummy-repo';
    });

    it.each(FACTORY_NAMES)('%s does not throw', async (name: FactoryName) => {
      const mod = loadRepositoriesFresh();
      await expect(mod[name]()).resolves.toBeDefined();
    });
  });
});
