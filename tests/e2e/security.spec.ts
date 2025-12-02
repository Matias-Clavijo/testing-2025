import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pom/AdminLoginPage';
import { SearchPage } from '../pom/SearchPage';

test.describe('CP-022 - SQL Injection protection', () => {
  test('Search input sanitizes payloads', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto();
    const payloads = [
      `' OR '1'='1`,
      `'; DROP TABLE productos; --`,
    ];
    for (const p of payloads) {
      await search.search(p);
      await search.expectBrowseVisible();
      //este utlimo chequea que no crashe
      await search.noServerErrorText();
    }
  });

  test('Contact/admin fields reject injection attempts', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login(`admin' OR '1'='1' --`, 'noMeImportaEstaPasswoird');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('CP-023 - XSS protection', () => {
  test('Inputs escape malicious scripts; no alert executed', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', () => { dialogFired = true; });

    const search = new SearchPage(page);
    await search.goto();
    const xssPayloads = [
      `<script>alert('XSS')</script>`,
      `<img src=x onerror=alert('XSS')>`,
      `<svg onload=alert('XSS')>`,
    ];
    for (const p of xssPayloads) {
      await search.search(p);
      await expect(page.locator('text=alert(')).toHaveCount(0);
    }
    expect(dialogFired).toBeFalsy();
  });
});


