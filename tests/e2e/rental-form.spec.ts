import { test, expect } from '@playwright/test';

async function openFirstItemDetail(page) {
  await page.goto('/');
  await page.getByRole('link', { name: /view details/i }).first().click();
  await expect(page.getByRole('heading', { name: /schedule a rental/i })).toBeVisible();
}

test.describe('CP-009, CP-010, CP-011, CP-036 - Rental form validation', () => {
  test('CP-009: Required fields validation and progressive completion', async ({ page }) => {
    await openFirstItemDetail(page);

    // Attempt submit with empty fields
    await page.getByRole('button', { name: /request rental/i }).click();
    // Expect no navigation away (simple heuristic)
    await expect(page).toHaveURL(/\/items\/\d+/);

    // Fill progressively
    await page.fill('#name', 'John Doe');
    await page.getByRole('button', { name: /request rental/i }).click();
    await expect(page).toHaveURL(/\/items\/\d+/);

    await page.fill('#email', 'john@example.com');
    await page.getByRole('button', { name: /request rental/i }).click();
    await expect(page).toHaveURL(/\/items\/\d+/);

    await page.fill('#phone', '+598 91234567');
    await page.getByRole('button', { name: /request rental/i }).click();
    await expect(page).toHaveURL(/\/items\/\d+/);

    // Dates last
    const today = new Date();
    const start = new Date(today); start.setDate(today.getDate() + 10);
    const end = new Date(today); end.setDate(today.getDate() + 12);
    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    await page.fill('#start', toISO(start));
    await page.fill('#end', toISO(end));

    // Final submit should proceed (assumes CSRF/session correctly configured in env)
    // We only assert the button remains enabled here.
    await expect(page.getByRole('button', { name: /request rental/i })).toBeEnabled();
  });

  test('CP-010: Phone format validation', async ({ page }) => {
    await openFirstItemDetail(page);
    await page.fill('#name', 'Jane');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#start', '2025-10-15');
    await page.fill('#end', '2025-10-18');

    const invalids = ['091234567', '123456789', '59891234567'];
    for (const ph of invalids) {
      await page.fill('#phone', ph);
      await page.getByRole('button', { name: /request rental/i }).click();
      await expect(page).toHaveURL(/\/items\/\d+/);
    }
    // Accept only international format
    await page.fill('#phone', '+598 91234567');
    await expect(page.getByRole('button', { name: /request rental/i })).toBeEnabled();
  });

  test('CP-011: Date validation rules', async ({ page }) => {
    await openFirstItemDetail(page);
    await page.fill('#name', 'Alice');
    await page.fill('#email', 'alice@example.com');
    await page.fill('#phone', '+598 91234567');

    // End before start
    await page.fill('#start', '2025-10-15');
    await page.fill('#end', '2025-10-10');
    await page.getByRole('button', { name: /request rental/i }).click();
    await expect(page).toHaveURL(/\/items\/\d+/);

    // Wrong format should be rejected (UI date input enforces format; backend also validates)
    await page.fill('#start', '15/10/2025');
    await page.fill('#end', '18/10/2025');
    await page.getByRole('button', { name: /request rental/i }).click();
    await expect(page).toHaveURL(/\/items\/\d+/);

    // Valid format dd/mm/yyyy via UI date -> equivalent ISO internally
    await page.fill('#start', '2025-10-15');
    await page.fill('#end', '2025-10-18');
    await expect(page.getByRole('button', { name: /request rental/i })).toBeEnabled();
  });

  test('CP-036: Invalid phone value prevents reservation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /featured/i }).scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /view details/i }).first().click();
    await expect(page.getByRole('heading', { name: /schedule a rental/i })).toBeVisible();

    await page.fill('#name', 'Sebastian');
    await page.fill('#email', 'seba@gmail.com');
    await page.fill('#phone', 'TestTest'); // invalid
    const today = new Date();
    const start = new Date(today); start.setDate(today.getDate() + 5);
    const end = new Date(today); end.setDate(today.getDate() + 7);
    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    await page.fill('#start', toISO(start));
    await page.fill('#end', toISO(end));
    await page.getByRole('button', { name: /request rental/i }).click();

    // Expect rejection (no success navigation)
    await expect(page).toHaveURL(/\/items\/\d+/);
  });
});


