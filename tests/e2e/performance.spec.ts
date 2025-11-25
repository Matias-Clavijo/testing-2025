import { test, expect } from '@playwright/test';

async function measureLoadMs(page, path: string) {
  const start = Date.now();
  await page.goto(path, { waitUntil: 'networkidle' });
  const end = Date.now();
  return end - start;
}

test.describe('CP-021 - Performance (<2s load)', () => {
  const paths = ['/', '/search', '/items/1', '/faq'];

  for (const p of paths) {
    test(`Page ${p} loads under 2s`, async ({ page }) => {
      const ms = await measureLoadMs(page, p);
      // Allow some headroom in CI; requirement target is <2000ms in production
      expect(ms).toBeLessThan(2000);
    });
  }
});


