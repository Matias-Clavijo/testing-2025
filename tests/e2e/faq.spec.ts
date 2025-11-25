import { test, expect } from '@playwright/test';

test.describe('CP-018 - FAQ page', () => {
  test('FAQ content present and accessible from main navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /faq/i }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole('heading', { name: /preguntas frecuentes/i })).toBeVisible();

    // Verify key topics
    const topics = [
      /pagos/i,
      /duración de alquiler/i,
      /extensiones/i,
      /tallas/i,
      /¿cómo funciona el alquiler\?/i,
      /¿incluye limpieza\?/i,
    ];
    for (const t of topics) {
      await expect(page.getByText(t)).toBeVisible();
    }
  });
});


