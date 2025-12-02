import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/HomePage';
import { ItemPage } from '../pom/ItemPage';

test.describe('CP-005, CP-006 - Item Detail & Images', () => {
  test.beforeEach(async ({ page }) => {
    // Go through homepage featured to reach a known item detail
    const home = new HomePage(page);
    await home.openFirstFeaturedDetail();
    const item = new ItemPage(page);
    await item.expectOnPage();
  });

  test('CP-005: Detail page shows images, description, sizes, price format, and back navigation', async ({ page }) => {
    const item = new ItemPage(page);
    // At least one image visible
    const images = item.images;
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);

    // Description is present (non-empty)
    const desc = await page.locator('p').nth(0).textContent();
    expect((desc?.trim().length || 0)).toBeGreaterThan(10);

    // Sizes info present
    await expect(item.sizesText).toBeVisible();

    // Price format USD with two decimals
    const priceText = await item.priceText.first().textContent();
    expect(priceText).toMatch(/\$[0-9]+(\.[0-9]{2})?\/day/i);

    // Back to catalog navigation exists (e.g., Browse link)
    await expect(item.browseLink).toBeVisible();
  });

  test('CP-006: Images quality and load', async ({ page }) => {
    const item = new ItemPage(page);
    // Ensure images are jpg/png and load with non-zero natural size
    const imgs = item.images;
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = imgs.nth(i);
      const src = await el.getAttribute('src');
      expect(src).toMatch(/\.(png|jpg|jpeg)(\?|$)/i);
      const size = await el.evaluate((img: HTMLImageElement) => ({
        w: img.naturalWidth,
        h: img.naturalHeight
      }));
      expect(size.w).toBeGreaterThan(0);
      expect(size.h).toBeGreaterThan(0);
    }
  });
});


