import { test, expect } from '@playwright/test';

test.describe('CP-031..CP-033 - UI and Navigation (partial/manual)', () => {
  test.skip('CP-031: Minimalist aesthetics (manual visual review)', async ({ page }) => {
    await page.goto('/');
    test.info().annotations.push({ type: 'manual', description: 'Review color palette (neutrals), single type family, spacing/balance, elegance.' });
  });

  test('CP-032: Images prominence and resolution (automated checks)', async ({ page }) => {
    await page.goto('/items/1');
    // Prominence: main image should be visible and large enough
    const heroImg = page.locator('img').first();
    await expect(heroImg).toBeVisible();
    const size = await heroImg.evaluate((img: HTMLImageElement) => ({ w: (img as any).clientWidth, h: (img as any).clientHeight }));
    expect(size.w).toBeGreaterThan(300);
    expect(size.h).toBeGreaterThan(400);
  });

  test('CP-033: Navigation intuitive - find product within 3 clicks', async ({ page }) => {
    await page.goto('/');
    // 1: Click Browse
    await page.getByRole('link', { name: /browse/i }).click();
    // 2: Search for red medium dress (dataset-dependent; use generic)
    await page.fill('input[name="q"]', 'dress');
    await page.getByRole('button', { name: /search/i }).click();
    // 3: Open first result
    await page.getByRole('link', { name: /view details/i }).first().click();
    await expect(page).toHaveURL(/\/items\/\d+/);
  });
});


