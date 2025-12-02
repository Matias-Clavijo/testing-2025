import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly queryInput: Locator;
  readonly searchButton: Locator;
  readonly browseHeading: Locator;
  readonly serverErrorLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.queryInput = page.locator('input[name="q"]');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.browseHeading = page.getByRole('heading', { name: /browse catalog/i });
    this.serverErrorLocator = page.locator('text=/error|exception|stack/i');
  }

  async goto(): Promise<void> {
    await this.page.goto('/search');
    await this.expectBrowseVisible();
  }

  async setQuery(q: string): Promise<void> {
    await this.queryInput.fill(q);
  }

  async submit(): Promise<void> {
    await this.searchButton.click();
  }

  async search(q: string): Promise<void> {
    await this.setQuery(q);
    await this.submit();
  }

  async expectBrowseVisible(): Promise<void> {
    await expect(this.browseHeading).toBeVisible();
  }

  async noServerErrorText(): Promise<void> {
    await expect(this.serverErrorLocator).toHaveCount(0);
  }
}
