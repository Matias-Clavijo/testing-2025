import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pom/AdminLoginPage';

test.describe('CP-022 - SQL Injection protection', () => {
  test('Search input sanitizes payloads', async ({ page }) => {
    await page.goto('/search');
    const payloads = [
      `' OR '1'='1`,
      `'; DROP TABLE productos; --`,
    ];
    for (const p of payloads) {
      await page.fill('input[name="q"]', p);
      await page.getByRole('button', { name: /search/i }).click();
      await expect(page.getByRole('heading', { name: /browse catalog/i })).toBeVisible();
      // Either empty or normal results, never a crash
      await expect(page.locator('text=/error|exception|stack/i')).toHaveCount(0);
    }
  });

  test('Contact/admin fields reject injection attempts', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login(`admin' OR '1'='1' --`, 'anything');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('CP-023 - XSS protection', () => {
  test('Inputs escape malicious scripts; no alert executed', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', () => { dialogFired = true; });

    await page.goto('/search');
    const xssPayloads = [
      `<script>alert('XSS')</script>`,
      `<img src=x onerror=alert('XSS')>`,
      `<svg onload=alert('XSS')>`,
    ];
    for (const p of xssPayloads) {
      await page.fill('input[name="q"]', p);
      await page.getByRole('button', { name: /search/i }).click();
      // App should render harmlessly (as text/ignored), not execute
      await expect(page.locator('text=alert(')).toHaveCount(0);
    }
    expect(dialogFired).toBeFalsy();
  });
});

test.describe('CP-024 - CSRF protection', () => {
  test('Sensitive actions require valid CSRF tokens', async ({ baseURL, request }) => {
    // Try admin login without CSRF
    const loginRes = await request.post(`${baseURL}/api/admin/login`, {
      form: { username: 'admin', password: 'admin123' },
    });
    expect(loginRes.status()).toBe(400);

    // Try cancel rental without admin session/CSRF
    const cancelRes = await request.post(`${baseURL}/api/admin/rentals/aaaaaaaa/cancel`, {
      form: {},
    });
    expect([400, 401]).toContain(cancelRes.status());
  });
});


