import { test, expect } from '@playwright/test';

test.describe('CP-001..CP-004, CP-034, CP-035 - Search and Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: /browse catalog/i })).toBeVisible();
  });

  test('CP-001: Filter Dresses by size M, color Black, style Formal', async ({ page }) => {
    // Note: Using style "black-tie" as a formal equivalent to align with dataset.
    await page.selectOption('select[name="category"]', 'dress');
    await page.locator('input[name="size"]').fill('M');
    await page.locator('input[name="color"]').fill('black');
    await page.locator('input[name="style"]').fill('formal');
    await page.getByRole('button', { name: /search/i }).click();

    // Filters persist
    await expect(page.locator('select[name="category"]')).toHaveValue('dress');
    await expect(page.locator('input[name="size"]')).toHaveValue('M');
    await expect(page.locator('input[name="color"]')).toHaveValue('black');
    await expect(page.locator('input[name="style"]')).toHaveValue('formal');

    // Results shown and each links to details
    const cards = page.locator('a:text("View details")');
    await expect(cards).toHaveCountGreaterThan(0);
  });

  test('CP-002: Filter Shoes by size 38 and color Red', async ({ page }) => {
    await page.selectOption('select[name="category"]', 'shoes');
    await page.locator('input[name="size"]').fill('38');
    await page.locator('input[name="color"]').fill('red');
    await page.getByRole('button', { name: /search/i }).click();

    // Filters persist
    await expect(page.locator('select[name="category"]')).toHaveValue('shoes');
    await expect(page.locator('input[name="size"]')).toHaveValue('38');
    await expect(page.locator('input[name="color"]')).toHaveValue('red');

    // Either matching results or informative empty state
    const empty = page.locator('text=No items match your filters.');
    const anyCard = page.locator('a:text("View details")');
    await expect.any([
      expect(empty).toBeVisible(),
      expect(anyCard).toHaveCountGreaterThan(0)
    ]);
  });

  test('CP-003: Accessories color Beige across Bags and Jackets', async ({ page }) => {
    // Bags
    await page.selectOption('select[name="category"]', 'bag');
    await page.locator('input[name="color"]').fill('beige');
    await page.getByRole('button', { name: /search/i }).click();
    await expect(page.locator('input[name="color"]')).toHaveValue('beige');
    // Either results or empty-state
    const bagEmpty = page.locator('text=No items match your filters.');
    const bagAny = page.locator('a:text("View details")');
    await expect.any([expect(bagEmpty).toBeVisible(), expect(bagAny).toHaveCountGreaterThan(0)]);

    // Jackets (color should persist if the app keeps query string)
    await page.selectOption('select[name="category"]', 'jacket');
    await page.getByRole('button', { name: /search/i }).click();
    await expect(page.locator('input[name="color"]')).toHaveValue('beige');
    const jacketEmpty = page.locator('text=No items match your filters.');
    const jacketAny = page.locator('a:text("View details")');
    await expect.any([expect(jacketEmpty).toBeVisible(), expect(jacketAny).toHaveCountGreaterThan(0)]);
  });

  test.fixme('CP-004: Multiple filters OR within category and AND across categories', async () => {
    // Backend currently supports single values per field; this case requires multi-select logic
    // and OR semantics inside a category (e.g., sizes S OR M). Marked as fixme pending feature support.
  });

  test('CP-034: Invalid size value shows empty state and no crash', async ({ page }) => {
    await page.selectOption('select[name="category"]', 'dress');
    await page.locator('input[name="size"]').fill('XXXL');
    await page.getByRole('button', { name: /search/i }).click();
    await expect(page.locator('text=No items match your filters.')).toBeVisible();
  });

  test('CP-035: Wrong color format shows empty state', async ({ page }) => {
    await page.selectOption('select[name="category"]', 'dress');
    await page.locator('input[name="color"]').fill('-123');
    await page.getByRole('button', { name: /search/i }).click();
    await expect(page.locator('text=No items match your filters.')).toBeVisible();
  });
});


