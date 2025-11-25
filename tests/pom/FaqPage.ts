import { Page, Locator, expect } from '@playwright/test';

export class FaqPage {
  readonly page: Page;
  readonly navLink: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLink = page.getByRole('link', { name: /faq/i });
    this.heading = page.getByRole('heading', { name: /preguntas frecuentes/i });
  }

  async gotoDirect(): Promise<void> {
    await this.page.goto('/faq');
  }

  async openFromMainNav(): Promise<void> {
    await this.page.goto('/');
    await this.navLink.click();
  }

  async expectOnFaq(): Promise<void> {
    await expect(this.page).toHaveURL(/\/faq$/);
    await expect(this.heading).toBeVisible();
  }

  async expectTopicsVisible(topics: RegExp[]): Promise<void> {
    for (const t of topics) {
      await expect(this.page.getByText(t)).toBeVisible();
    }
  }
}


