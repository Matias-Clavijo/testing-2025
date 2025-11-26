import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/HomePage';
import { SearchPage } from '../pom/SearchPage';

async function assertNoHorizontalScroll(page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBeFalsy();
}

test.describe('CP-026 - Desktop responsiveness', () => {
  const sizes = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 2560, height: 1440 },
  ];

  for (const vp of sizes) {
    test(`Desktop layout ok at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      const home = new HomePage(page);
      await home.goto();
      await expect(home.browseLink).toBeVisible();
      await assertNoHorizontalScroll(page);
    });
  }
});

test.describe('CP-027 - Mobile responsiveness', () => {
  const mobile = [
    { width: 375, height: 667, label: 'iPhone-like' },
    { width: 360, height: 640, label: 'Android-like' },
  ];

  for (const vp of mobile) {
    test(`Mobile layout ok at ${vp.label} ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const home = new HomePage(page);
      await home.goto();
      await assertNoHorizontalScroll(page);

      await home.browseLink.waitFor({ state: 'visible' });
      await Promise.all([
        page.waitForURL(/\/search/),
        home.browseLink.click(),
      ]);
      const search = new SearchPage(page);
      await search.expectBrowseVisible();
    });
  }
});


