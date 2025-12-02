import { test } from '@playwright/test';
import { FaqPage } from '../pom/FaqPage';

test.describe('CP-018 - FAQ page', () => {
  test('FAQ content present and accessible from main navigation', async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.openFromMainNav();
    await faq.expectOnFaq();

    await faq.expectTopicsVisible([
      /¿qué métodos de pago aceptan\?/i,
      /¿qué tallas están disponibles\?/i,
      /¿puedo cancelar mi reserva\?/i,
      /¿qué pasa si devuelvo el vestido más tarde/i,
      /¿qué ocurre si el vestido se daña durante el uso\?/i,
      /¿puedo probarme el vestido antes de alquilarlo\?/i,
    ]);
  });
});