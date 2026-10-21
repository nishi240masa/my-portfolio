import { defineConfig, devices } from '@playwright/test';

/**
 * 公開ページのスモーク + a11y チェック用 Playwright 設定。
 * - `yarn build && yarn start` した上で http://localhost:3000 を叩く
 * - CI では reuseExistingServer:false で安定実行
 * - /journal は本番データ data/feeds.json ではなく tests/e2e/fixtures/feeds.json で build する
 *   (FEEDS_FILE → next.config.mjs の webpack 差し替え)。ローカルで既存サーバを reuse した
 *   場合はこの差し替えが効かないので、journal cards テストは fixture build で実行すること
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn build && yarn start',
    url: 'http://localhost:3000/home',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      FEEDS_FILE: 'tests/e2e/fixtures/feeds.json',
    },
  },
});
