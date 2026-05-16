import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage
 * Abstract base class for all Page Objects.
 * Provides shared navigation, wait helpers, and assertion utilities
 * so individual page classes stay DRY and focused on their own selectors/actions.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to a relative or absolute URL */
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
    await this.waitForLoad();
  }

  /** Wait for the network to settle — avoids brittle fixed timeouts */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Return the current page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Assert that a locator is visible within the default action timeout */
  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /** Assert that a locator contains a specific text substring */
  async assertText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /** Assert current URL contains a given substring */
  async assertUrlContains(substring: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(substring));
  }

  /** Safe fill — clears the field before typing to prevent ghost input */
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }
}
