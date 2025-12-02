import { Page, Locator, expect } from '@playwright/test';

export class ItemPage {
  readonly page: Page;
  readonly scheduleHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly startInput: Locator;
  readonly endInput: Locator;
  readonly requestButton: Locator;
  readonly images: Locator;
  readonly sizesText: Locator;
  readonly priceText: Locator;
  readonly browseLink: Locator;
  readonly calendarCells: Locator;
  readonly bookedCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.scheduleHeading = page.getByRole('heading', { name: /schedule a rental/i });
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.startInput = page.locator('#start');
    this.endInput = page.locator('#end');
    this.requestButton = page.getByRole('button', { name: /request rental/i });
    this.images = page.locator('img');
    this.sizesText = page.locator('text=Sizes:');
    this.priceText = page.locator('text=From $');
    this.browseLink = page.getByRole('link', { name: /browse/i });
    this.calendarCells = page.locator('[title^="20"]');
    this.bookedCells = page.locator('text=Booked');
  }

  async gotoById(id: number): Promise<void> {
    await this.page.goto(`/items/${id}`);
    await expect(this.scheduleHeading).toBeVisible();
  }

  async fillRentalForm(data: { name?: string; email?: string; phone?: string; start?: string; end?: string }): Promise<void> {
    const { name, email, phone, start, end } = data;
    if (name !== undefined) await this.nameInput.fill(name);
    if (email !== undefined) await this.emailInput.fill(email);
    if (phone !== undefined) await this.phoneInput.fill(phone);
    if (start !== undefined) await this.startInput.fill(start);
    if (end !== undefined) await this.endInput.fill(end);
  }

  async submitRental(): Promise<void> {
    await this.requestButton.click();
  }

  async expectOnPage(): Promise<void> {
    await expect(this.scheduleHeading).toBeVisible();
  }
}

