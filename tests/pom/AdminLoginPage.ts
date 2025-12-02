import { Page, Locator, expect } from '@playwright/test';

export class AdminLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly adminSignInHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: /username/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    // Only check for presence of an H1 element (any text)
    this.adminSignInHeading = page.locator('h1');
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/login');
    await this.expectLoginPageVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectLoginPageVisible(): Promise<void> {
    // Verify that at least one H1 exists on the page
    const count = await this.adminSignInHeading.count();
    //get url
    expect(count).toBeGreaterThan(0);
  }

  async expectLoginErrorVisible(): Promise<void> {
    const errorLocator = this.page.locator('text=Invalid credentials');
    await expect(errorLocator).toBeVisible();
  }
}


