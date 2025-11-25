import { Page, Locator, expect } from '@playwright/test';

export class AdminLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly adminSignInHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.adminSignInHeading = page.getByRole('heading', { name: 'Admin sign in' });
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
    await expect(this.adminSignInHeading).toBeVisible();
  }
}


