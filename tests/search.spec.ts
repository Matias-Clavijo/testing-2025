import { test, expect } from '@playwright/test';

test.describe('Search page', () => {
  test('filters results for unmatched query', async ({ page }) => {
    await page.goto('/search');

    await page.getByPlaceholder('Search…').fill('zzzz-nonexistent');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('No items match your filters.')).toBeVisible();
  });

  test('navigates to item details from search card', async ({ page }) => {
    await page.goto('/search');

    // Click first "View details" link if results present
    const viewDetail = page.getByRole('link', { name: 'View details' }).first();
    const count = await viewDetail.count();
    if (count > 0) {
      await viewDetail.click();
      await expect(page).toHaveURL(/\/items\//);
    } else {
      test.skip(true, 'No items available to click');
    }
  });
});
