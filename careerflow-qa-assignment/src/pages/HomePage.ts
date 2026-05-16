import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage
 * Represents the Automation Exercise landing page.
 * Encapsulates all selectors and interactions specific to the home route.
 */
export class HomePage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  readonly signupLoginLink: Locator;
  readonly homePageLogo: Locator;
  readonly sliderSection: Locator;
  readonly featuredItemsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink    = page.locator('a[href="/login"]');
    this.homePageLogo       = page.locator('#header .logo');
    this.sliderSection      = page.locator('#slider');
    this.featuredItemsSection = page.locator('.features_items');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Open the site root */
  async open(): Promise<void> {
    await this.goto('/');
  }

  /** Click the Signup / Login navigation link */
  async goToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
    await this.page.waitForURL(/.*login.*/);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertHomePageLoaded(): Promise<void> {
    await this.assertVisible(this.homePageLogo, 'Logo should be visible on homepage');
    await this.assertVisible(this.sliderSection, 'Hero slider should be visible');
    await this.assertVisible(this.featuredItemsSection, 'Featured products should be visible');
  }
}
