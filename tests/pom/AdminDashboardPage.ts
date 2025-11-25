import { Page, Locator, expect } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly cancelButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /admin dashboard/i });
    this.cancelButtons = page.getByRole('button', { name: /cancel/i });
  }

  async expectVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin');
  }
}


