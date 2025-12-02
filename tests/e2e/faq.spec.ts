import { test } from '@playwright/test';
import { FaqPage } from '../pom/FaqPage';

test.describe('CP-018 - FAQ page', () => {
  test('FAQ content present and accessible from main navigation', async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.openFromMainNav();
    await faq.expectOnFaq();

    await faq.expectTopicsVisible([
      /pagos/i,
      /duración de alquiler/i,
      /extensiones/i,
      /tallas/i,
      /¿cómo funciona el alquiler\?/i,
      /¿incluye limpieza\?/i,
    ]);
  });
});