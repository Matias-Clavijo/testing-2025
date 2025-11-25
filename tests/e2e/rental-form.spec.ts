import { test, expect } from '@playwright/test';

async function openFirstItemDetail(page) {
  await page.goto('/');
  await page.getByRole('link', { name: /view details/i }).first().click();
  await expect(page.getByRole('heading', { name: /schedule a rental/i })).toBeVisible();
}

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function futureDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISO(d);
}

test.describe('CP-009, CP-010, CP-011, CP-036 - Rental form validation', () => {
  test('CP-009: Required fields validation and progressive completion', async ({ page }) => {
    await openFirstItemDetail(page);

    const submit = page.getByRole('button', { name: /request rental/i });

    await test.step('Empty submit rejected', async () => {
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill name only', async () => {
      await page.fill('#name', 'John Doe');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill email', async () => {
      await page.fill('#email', 'john@example.com');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill phone', async () => {
      await page.fill('#phone', '+598 91234567');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill valid dates', async () => {
      await page.fill('#start', futureDate(10));
      await page.fill('#end', futureDate(12));
      await expect(submit).toBeEnabled();
    });
  });

  test('CP-010: Phone format validation', async ({ page }) => {
    await openFirstItemDetail(page);

    await page.fill('#name', 'Jane');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#start', '2025-10-15');
    await page.fill('#end', '2025-10-18');

    const submit = page.getByRole('button', { name: /request rental/i });
    const invalidPhones = ['091234567', '123456789', '59891234567'];

    for (const value of invalidPhones) {
      await page.fill('#phone', value);
      await submit.click();
      await expect(submit).toBeEnabled();
    }

    await page.fill('#phone', '+598 91234567');
    await expect(submit).toBeEnabled();
  });

  test('CP-011: Date validation rules', async ({ page }) => {
    await openFirstItemDetail(page);

    await page.fill('#name', 'Alice');
    await page.fill('#email', 'alice@example.com');
    await page.fill('#phone', '+598 91234567');

    const submit = page.getByRole('button', { name: /request rental/i });

    await test.step('End date before start date', async () => {
      await page.fill('#start', '2025-10-15');
      await page.fill('#end', '2025-10-10');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Incorrect date format rejected', async () => {
      await page.fill('#start', '15/10/2025');
      await page.fill('#end', '18/10/2025');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Valid ISO date format accepted', async () => {
      await page.fill('#start', '2025-10-15');
      await page.fill('#end', '2025-10-18');
      await expect(submit).toBeEnabled();
    });
  });

  test('CP-036: Invalid phone value prevents reservation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /featured/i }).scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /view details/i }).first().click();
    await expect(page.getByRole('heading', { name: /schedule a rental/i })).toBeVisible();

    await page.fill('#name', 'Sebastian');
    await page.fill('#email', 'seba@gmail.com');
    await page.fill('#phone', 'TestTest');

    await page.fill('#start', futureDate(5));
    await page.fill('#end', futureDate(7));

    const submit = page.getByRole('button', { name: /request rental/i });
    await submit.click();

    await expect(submit).toBeEnabled();
  });
});
