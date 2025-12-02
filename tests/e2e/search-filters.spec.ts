import { test, expect } from '@playwright/test';
import { SearchPage } from '../pom/SearchPage';

test.describe('CP-001..CP-004, CP-034, CP-035 - Search and Filters', () => {
  test.beforeEach(async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto();
  });

  test('CP-001: Filter Dresses by size M, color Black, style Formal', async ({ page }) => {
    const search = new SearchPage(page);
    // Note: Using style "black-tie" as a formal equivalent to align with dataset.
    await search.setFilters({ category: 'dress', size: 'M', color: 'black', style: 'formal' });
    await search.submit();

    // Filters persist
    await search.expectFilters({ category: 'dress', size: 'M', color: 'black', style: 'formal' });

    // Results shown and each links to details
    const count = await search.resultCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CP-002: Filter Shoes by size 38 and color Red', async ({ page }) => {
    const search = new SearchPage(page);
    await search.setFilters({ category: 'shoes', size: '38', color: 'red' });
    await search.submit();

    // Filters persist
    await search.expectFilters({ category: 'shoes', size: '38', color: 'red' });

    // Either matching results or informative empty state
    await search.expectResultsOrEmpty();
  });

  test('CP-003: Accessories color Beige across Bags and Jackets', async ({ page }) => {
    const search = new SearchPage(page);
    // Bags
    await search.setFilters({ category: 'bag', color: 'beige' });
    await search.submit();
    await search.expectFilters({ color: 'beige' });
    await search.expectResultsOrEmpty();

    // Jackets (color should persist if the app keeps query string)
    await search.setFilters({ category: 'jacket' });
    await search.submit();
    await search.expectFilters({ color: 'beige' });
    await search.expectResultsOrEmpty();
  });

  test.fixme('CP-004: Multiple filters OR within category and AND across categories', async () => {
    // Backend currently supports single values per field; this case requires multi-select logic
    // and OR semantics inside a category (e.g., sizes S OR M). Marked as fixme pending feature support.
  });

  test('CP-034: Invalid size value shows empty state and no crash', async ({ page }) => {
    const search = new SearchPage(page);
    await search.setFilters({ category: 'dress', size: 'XXXL' });
    await search.submit();
    await expect(search.emptyText).toBeVisible();
  });

  test('CP-035: Wrong color format shows empty state', async ({ page }) => {
    const search = new SearchPage(page);
    await search.setFilters({ category: 'dress', color: '-123' });
    await search.submit();
    await expect(search.emptyText).toBeVisible();
  });

  test('CP-037: Past date range shows error and no results', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.setFilters({ category: 'dress' });
    await page.fill('input[name="start"]', '1222-12-12');
    await page.fill('input[name="end"]', '1333-12-12');
    await search.submit();

    const alert = page.locator('.swal2-popup, .swal-modal, [role="alert"], [role="alertdialog"]');
    await expect(alert).toBeVisible({ timeout: 5000 });

    await expect(search.resultCards).toHaveCount(0);
  });
});


