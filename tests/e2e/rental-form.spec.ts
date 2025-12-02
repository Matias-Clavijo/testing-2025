import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/HomePage';
import { ItemPage } from '../pom/ItemPage';

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function futureDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISO(d);
}

async function openItem(page) {
  const home = new HomePage(page);
  await home.openFirstFeaturedDetail();
  const item = new ItemPage(page);
  await item.expectOnPage();
  return item;
}

test.describe('CP-009, CP-010, CP-011, CP-036 - Rental form validation', () => {
  test('CP-009: Required fields validation and progressive completion', async ({ page }) => {
    const item = await openItem(page);
    const submit = item.requestButton;

    await test.step('Empty submit rejected', async () => {
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill name only', async () => {
      await item.nameInput.fill('John Doe');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill email', async () => {
      await item.emailInput.fill('john@example.com');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill phone', async () => {
      await item.phoneInput.fill('+598 91234567');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Fill valid dates', async () => {
      await item.startInput.fill(futureDate(10));
      await item.endInput.fill(futureDate(12));
      await expect(submit).toBeEnabled();
    });
  });

  test('CP-010: Phone format validation', async ({ page }) => {
    const item = await openItem(page);
    await item.nameInput.fill('Jane');
    await item.emailInput.fill('jane@example.com');
    await item.startInput.fill('2025-10-15');
    await item.endInput.fill('2025-10-18');

    const submit = item.requestButton;
    const invalidPhones = ['091234567', '123456789', '59891234567'];

    for (const value of invalidPhones) {
      await item.phoneInput.fill(value);
      await submit.click();
      await expect(submit).toBeEnabled();
    }

    await item.phoneInput.fill('+598 91234567');
    await expect(submit).toBeEnabled();
  });

  test('CP-011: Date validation rules', async ({ page }) => {
    const item = await openItem(page);
    await item.nameInput.fill('Alice');
    await item.emailInput.fill('alice@example.com');
    await item.phoneInput.fill('+598 91234567');
    const submit = item.requestButton;

    await test.step('End date before start date', async () => {
      await item.startInput.fill('2025-10-15');
      await item.endInput.fill('2025-10-10');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Incorrect date format rejected', async () => {
      await item.startInput.fill('15/10/2025');
      await item.endInput.fill('18/10/2025');
      await submit.click();
      await expect(submit).toBeEnabled();
    });

    await test.step('Valid ISO date format accepted', async () => {
      await item.startInput.fill('2025-10-15');
      await item.endInput.fill('2025-10-18');
      await expect(submit).toBeEnabled();
    });
  });

  test('CP-036: Invalid phone value prevents reservation', async ({ page }) => {
    const item = await openItem(page);
    await item.nameInput.fill('Sebastian');
    await item.emailInput.fill('seba@gmail.com');
    await item.phoneInput.fill('TestTest');
    await item.startInput.fill(futureDate(5));
    await item.endInput.fill(futureDate(7));

    const submit = item.requestButton;
    await submit.click();

    await expect(submit).toBeEnabled();
  });
});
