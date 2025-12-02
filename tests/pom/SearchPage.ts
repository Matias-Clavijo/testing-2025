import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly queryInput: Locator;
  readonly searchButton: Locator;
  readonly browseHeading: Locator;
  readonly serverErrorLocator: Locator;
  readonly categorySelect: Locator;
  readonly sizeInput: Locator;
  readonly colorInput: Locator;
  readonly styleInput: Locator;
  readonly startInput: Locator;
  readonly endInput: Locator;
  readonly resultCards: Locator;
  readonly emptyText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.queryInput = page.locator('input[name="q"]');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.browseHeading = page.getByRole('heading', { name: /browse catalog/i });
    this.serverErrorLocator = page.locator('text=/error|exception|stack/i');
    this.categorySelect = page.locator('select[name="category"]');
    this.sizeInput = page.locator('input[name="size"]');
    this.colorInput = page.locator('input[name="color"]');
    this.styleInput = page.locator('input[name="style"]');
    this.startInput = page.locator('input[name="start"]');
    this.endInput = page.locator('input[name="end"]');
    this.resultCards = page.locator('a:has-text("View details")');
    this.emptyText = page.getByText(/no items match your filters/i);
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

  async setFilters(filters: {
    q?: string;
    category?: string;
    size?: string;
    color?: string;
    style?: string;
    start?: string;
    end?: string;
  }): Promise<void> {
    const { q, category, size, color, style, start, end } = filters;
    if (q !== undefined) await this.queryInput.fill(q);
    if (category !== undefined) await this.categorySelect.selectOption({ value: category });
    if (size !== undefined) await this.sizeInput.fill(size);
    if (color !== undefined) await this.colorInput.fill(color);
    if (style !== undefined) await this.styleInput.fill(style);
    if (start !== undefined) await this.startInput.fill(start);
    if (end !== undefined) await this.endInput.fill(end);
  }

  async expectFilters(filters: {
    q?: string;
    category?: string;
    size?: string;
    color?: string;
    style?: string;
    start?: string;
    end?: string;
  }): Promise<void> {
    const { q, category, size, color, style, start, end } = filters;
    if (q !== undefined) await expect(this.queryInput).toHaveValue(q);
    if (category !== undefined) await expect(this.categorySelect).toHaveValue(category);
    if (size !== undefined) await expect(this.sizeInput).toHaveValue(size);
    if (color !== undefined) await expect(this.colorInput).toHaveValue(color);
    if (style !== undefined) await expect(this.styleInput).toHaveValue(style);
    if (start !== undefined) await expect(this.startInput).toHaveValue(start);
    if (end !== undefined) await expect(this.endInput).toHaveValue(end);
  }

  async expectResultsOrEmpty(): Promise<void> {
    const resultsCount = await this.resultCards.count();
    if (resultsCount > 0) {
      await expect(this.resultCards.first()).toBeVisible();
    } else {
      await expect(this.emptyText).toBeVisible();
    }
  }
}
