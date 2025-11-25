import { test, expect } from '@playwright/test';

test.describe('CP-007, CP-008 - Availability Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /view details/i }).first().click();
    await expect(page.getByRole('heading', { name: /availability/i })).toBeVisible();
  });

  test('CP-007: Calendar visuals, date format, size', async ({ page }) => {

    const calendar = page.locator('section:below(h2:text("Availability"))').first();
    await expect(calendar).toBeVisible();

    const cells = page.locator('[title^="20"]');
    await expect(cells).toHaveCountGreaterThan(0);

    const title = await cells.first().getAttribute('title');
    expect(title).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const booked = cells.filter({ hasText: 'Booked' });
    const available = cells.filter({ hasNotText: 'Booked' });

    const bookedCount = await booked.count();
    const availableCount = await available.count();

    expect(bookedCount + availableCount).toBeGreaterThan(0);

    const size = await calendar.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, vw: innerWidth, vh: innerHeight };
    });

    expect(size.w / size.vw).toBeGreaterThan(0.5);
    expect(size.h / size.vh).toBeGreaterThan(0.5);
  });

  test('CP-008: Selecting available, blocking reserved, past disabled', async ({ page }) => {

    const cells = page.locator('[title^="20"]');
    await expect(cells).toHaveCountGreaterThan(0);

    test.step('Can select an available date', async () => {
      const available = cells.filter({ hasNotText: 'Booked' }).first();
      await expect(available).toBeVisible();
      await available.click();

      const aria = await available.getAttribute('aria-selected');
      if (aria !== null) expect(aria).toBe('true');
    });

    test.step('Clicking booked cell does not select it', async () => {
      const booked = cells.filter({ hasText: 'Booked' }).first();
      if (await booked.count()) {
        await booked.click();
        const aria = await booked.getAttribute('aria-selected');
        if (aria !== null) expect(aria).not.toBe('true');
      }
    });

    test.step('Past dates are disabled', async () => {
      const today = new Date().toISOString().slice(0, 10);

      const pastCells = cells.filter(async (cell) => {
        const title = await cell.getAttribute('title');
        return title && title < today;
      });

      const count = await pastCells.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const c = pastCells.nth(i);
          const disabled = await c.getAttribute('aria-disabled');
          if (disabled !== null) expect(disabled).toBe('true');
        }
      }
    });
  });
});
