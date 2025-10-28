import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('shows header and nav links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'GlamRent' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'How it works' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Featured' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible();
  });

  test('navigates to search via Browse link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Browse', exact: true }).first().click();
    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByRole('heading', { name: 'Browse catalog' })).toBeVisible();
  });
});


