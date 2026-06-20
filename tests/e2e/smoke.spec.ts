import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface PageCase {
  path: string;
  expectedHeading: RegExp;
}

const PAGES: PageCase[] = [
  { path: '/home', expectedHeading: /./ },
  { path: '/production', expectedHeading: /作品|つくった/ },
  { path: '/profile', expectedHeading: /プロフィール|profile|PROFILE|西尾/i },
  { path: '/skill', expectedHeading: /スキル|skill|SKILL/i },
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
    test(`${path} has no critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(critical, `critical a11y violations on ${path}: ${JSON.stringify(critical, null, 2)}`).toEqual([]);
    });
  }
});
