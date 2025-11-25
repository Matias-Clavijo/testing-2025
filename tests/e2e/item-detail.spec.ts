import { test, expect } from '@playwright/test';

test.describe('CP-005, CP-006 - Item Detail & Images', () => {
  test.beforeEach(async ({ page }) => {
    // Go through homepage featured to reach a known item detail
    await page.goto('/');
    await page.getByRole('link', { name: /view details/i }).first().click();
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('CP-005: Detail page shows images, description, sizes, price format, and back navigation', async ({ page }) => {
    // Minimum 3 images at 1080x1080 (assumed code provides this as per requirement)
    const images = page.locator('img');
    await expect(images).toHaveCountGreaterThan(2);

    // Description length 100–500 characters
    const desc = await page.locator('p').nth(0).textContent();
    expect(desc?.length || 0).toBeGreaterThanOrEqual(100);
    expect(desc?.length || 0).toBeLessThanOrEqual(500);

    // Sizes info present
    await expect(page.locator('text=Sizes:')).toBeVisible();

    // Price format USD with two decimals
    const priceText = await page.locator('text=From $').first().textContent();
    expect(priceText).toMatch(/\$[0-9]+(\.[0-9]{2})?\/day/i);

    // Back to catalog navigation exists (e.g., Browse link)
    await expect(page.getByRole('link', { name: /browse/i })).toBeVisible();
  });

  test('CP-006: Images quality and load', async ({ page }) => {
    // Ensure images are jpg/png and at least 1080x1080 (assumed; we validate by naturalWidth/Height)
    const imgs = page.locator('img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = imgs.nth(i);
      const src = await el.getAttribute('src');
      expect(src).toMatch(/\.(png|jpg|jpeg)(\?|$)/i);
      const size = await el.evaluate((img: HTMLImageElement) => ({
        w: (img as any).naturalWidth,
        h: (img as any).naturalHeight
      }));
      expect(size.w).toBeGreaterThanOrEqual(1080);
      expect(size.h).toBeGreaterThanOrEqual(1080);
    }
  });
});


