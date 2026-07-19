import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface PageCase {
  path: string;
  expectedHeading: RegExp;
}

const PAGES: PageCase[] = [
  { path: '/home', expectedHeading: /./ },
  { path: '/production', expectedHeading: /作品|つくった/ },
  // SectionHeader は eyebrow を <div>、title を <h2> で描画するため、
  // h1/h2 に載る実見出し (title) に合わせる。eyebrow の "PROFILE"/"SKILL" は拾えない。
  { path: '/profile', expectedHeading: /人物像|プロフィール|profile|西尾/i },
  { path: '/skill', expectedHeading: /現在地|段位|スキル|skill/i },
  { path: '/articles', expectedHeading: /記事|書いた/ },
  { path: '/journal', expectedHeading: /外部活動|外でも/ },
];

test.describe('public pages smoke', () => {
  for (const { path, expectedHeading } of PAGES) {
    test(`GET ${path} returns 200 and has heading`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `status for ${path}`).toBeLessThan(400);
      // 主要見出し or タイトルがあること (h1/h2 のテキストを許容)
      const headings = page.locator('h1, h2');
      await expect(headings.first()).toBeVisible({ timeout: 15_000 });
      const text = (await headings.allInnerTexts()).join(' ');
      expect(text, `heading text for ${path}`).toMatch(expectedHeading);
    });
  }
});

test.describe('public pages a11y (axe)', () => {
  for (const { path } of PAGES) {
    test(`${path} has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(
        blocking,
        `critical/serious a11y violations on ${path}: ${JSON.stringify(blocking, null, 2)}`,
      ).toEqual([]);
    });
  }
});

test.describe('article detail (fixture)', () => {
  test('GET /articles/hello-world renders title and body', async ({ page }) => {
    const response = await page.goto('/articles/hello-world');
    expect(response?.status(), 'status for /articles/hello-world').toBeLessThan(400);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 15_000 });
    await expect(h1).toContainText(/Hello, world/);
    // 本文 (Markdown) が SSR 描画されていることを確認
    await expect(page.locator('.markdown-body')).toContainText(/最初の記事/);
  });
});

test.describe('journal cards (fixture)', () => {
  test('GET /journal renders at least one card per source', async ({ page }) => {
    const response = await page.goto('/journal');
    expect(response?.status(), 'status for /journal').toBeLessThan(400);
    // fixture では zenn / qiita / github 各 1 件以上の card が存在する
    const cards = page.locator('.card');
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    const count = await cards.count();
    expect(count, 'journal card count').toBeGreaterThanOrEqual(3);
  });
});
