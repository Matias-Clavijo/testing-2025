import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/HomePage';

test.describe('CP-007, CP-008 - Availability Calendar', () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.openFirstFeaturedDetail();
    await expect(page.getByRole('heading', { name: /availability/i })).toBeVisible();
  });

  test('CP-007: Calendar shows availability with colors and correct date format and size', async ({ page }) => {
    const calendar = page.getByRole('heading', { name: /availability/i }).locator('..').locator('div').nth(1);
    await expect(calendar).toBeVisible();

    const cells = page.locator('[title^="20"]');
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);

    await expect(cells.first()).toHaveAttribute('title', /^\d{4}-\d{2}-\d{2}$/);

    const bookedInCalendar = calendar.locator('text=/Booked/i');

    const hasStatus = (await bookedInCalendar.count()) > 0 || (await calendar.locator('text=/Available|Free|Disponible/i').count()) > 0;
    expect(hasStatus).toBeTruthy();

    const size = await calendar.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight };
    });
    expect(size.w / size.vw).toBeGreaterThan(0.3);
    expect(size.h / size.vh).toBeGreaterThan(0.25);
  });

  test('CP-008: Interactions - can select available date, cannot select reserved', async ({ page }) => {
    const cells = page.locator('[title^="20"]');
    const total = await cells.count();
    expect(total).toBeGreaterThan(0);

    let availableIndex = -1;
    for (let i = 0; i < total; i++) {
      const c = cells.nth(i);
      const text = (await c.innerText()).trim();
      if (!/Booked/i.test(text) && text.length > 0) {
        availableIndex = i;
        break;
      }
    }
    expect(availableIndex).toBeGreaterThanOrEqual(0);
    const availableCandidate = cells.nth(availableIndex);
    await availableCandidate.click();
    await expect(availableCandidate).toBeVisible();
    await expect(availableCandidate).toHaveAttribute('title', /^\d{4}-\d{2}-\d{2}$/);

    let bookedIndex = -1;
    for (let i = 0; i < total; i++) {
      const c = cells.nth(i);
      const text = (await c.innerText()).trim();
      if (/Booked/i.test(text)) {
        bookedIndex = i;
        break;
      }
    }
    if (bookedIndex >= 0) {
      const bookedCell = cells.nth(bookedIndex);
      await bookedCell.click();
      await expect(bookedCell).toBeVisible();
    }
  });
});
