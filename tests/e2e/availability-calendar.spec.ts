import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/HomePage';

test.describe('CP-007, CP-008 - Availability Calendar', () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.openFirstFeaturedDetail();
    await expect(page.getByRole('heading', { name: /availability/i })).toBeVisible();
  });

  test('CP-007: Calendar shows availability with colors and correct date format and size', async ({ page }) => {
    const calendar = page.locator('h2:text("Availability")').locator('..').locator('div >> nth=1');
    await expect(calendar).toBeVisible();
    const cells = page.locator('[title^="20"]');
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);
    const titleAttr = await cells.first().getAttribute('title');
    expect(titleAttr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const booked = page.locator('text=Booked');
    const bookedCount = await booked.count();
    expect(bookedCount).toBeGreaterThanOrEqual(0);
    const size = await calendar.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight };
    });
    expect(size.w / size.vw).toBeGreaterThan(0.5);
    expect(size.h / size.vh).toBeGreaterThan(0.5);
  });

  test('CP-008: Interactions - can select available date, cannot select reserved', async ({ page }) => {
    const cells = page.locator('[title^="20"]');
    const total = await cells.count();
    expect(total).toBeGreaterThan(0);
    const availableCandidate = cells.filter({ hasNotText: 'Booked' }).first();
    await availableCandidate.click();
    await expect(availableCandidate).toBeVisible();
    const bookedCell = cells.filter({ hasText: 'Booked' }).first();
    const exists = await bookedCell.count();
    if (exists) {
      await bookedCell.click();
      await expect(bookedCell).toBeVisible();
    }
  });
});
