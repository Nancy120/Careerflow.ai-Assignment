import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AccountPage
 * Represents the state after a user has successfully logged in.
 * Verifies the authenticated navbar and provides logout capability.
 */
export class AccountPage extends BasePage {
  readonly loggedInAsLabel: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.loggedInAsLabel  = page.locator('a:has-text("Logged in as")');
    this.logoutLink       = page.locator('a[href="/logout"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL(/.*login.*/);
  }

  /** Clean up: delete the test account after the test so the email is reusable */
  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await this.page.waitForURL(/.*delete_account.*/);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertLoggedIn(username: string): Promise<void> {
    await this.assertVisible(this.loggedInAsLabel, 'Logged-in label must be present in nav');
    await this.assertText(this.loggedInAsLabel, username);
  }

  async assertLogoutVisible(): Promise<void> {
    await this.assertVisible(this.logoutLink, 'Logout link must be present when authenticated');
  }
}
