import { test, expect } from '@playwright/test';

test.describe('CP-028..CP-030 - Browser compatibility smoke (no JS console errors)', () => {
  test('Core flows render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const paths = ['/', '/search', '/items/1', '/admin/login'];
    for (const p of paths) {
      await page.goto(p);
      await page.waitForLoadState('domcontentloaded');
    }
    expect(errors, `Console errors found:\n${errors.join('\n')}`).toHaveLength(0);
  });
});


