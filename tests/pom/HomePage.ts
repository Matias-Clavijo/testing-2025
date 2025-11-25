import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly browseLink: Locator;
  readonly faqLink: Locator;
  readonly firstFeaturedViewDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.browseLink = page.getByRole('link', { name: /browse/i });
    this.faqLink = page.getByRole('link', { name: /faq/i });
    this.firstFeaturedViewDetails = page.getByRole('link', { name: /view details/i }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async goToBrowse(): Promise<void> {
    await this.goto();
    await this.browseLink.click();
  }

  async openFirstFeaturedDetail(): Promise<void> {
    await this.goto();
    await this.firstFeaturedViewDetails.click();
  }
}


