import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SignupLoginPage
 * Covers both the "New User Signup" and "Login" forms
 * that coexist on /login of automationexercise.com.
 */
export class SignupLoginPage extends BasePage {
  // ── Signup section ────────────────────────────────────────────────────────
  readonly signupHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // ── Login section ─────────────────────────────────────────────────────────
  readonly loginHeading: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Signup
    this.signupHeading   = page.locator('.signup-form h2');
    this.signupNameInput  = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton     = page.locator('[data-qa="signup-button"]');

    // Login
    this.loginHeading       = page.locator('.login-form h2');
    this.loginEmailInput    = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton        = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage  = page.locator('.login-form p');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Fill the signup form with name and email, then click Signup */
  async fillSignupForm(name: string, email: string): Promise<void> {
    await this.fillField(this.signupNameInput, name);
    await this.fillField(this.signupEmailInput, email);
    await this.signupButton.click();
    // Wait for navigation to the account-info registration form
    await this.page.waitForURL(/.*signup.*/);
  }

  /** Fill the login form and submit */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.fillField(this.loginEmailInput, email);
    await this.fillField(this.loginPasswordInput, password);
    await this.loginButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertSignupFormVisible(): Promise<void> {
    await this.assertVisible(this.signupHeading);
    await this.assertText(this.signupHeading, 'New User Signup!');
  }

  async assertLoginFormVisible(): Promise<void> {
    await this.assertVisible(this.loginHeading);
    await this.assertText(this.loginHeading, 'Login to your account');
  }

  async assertLoginError(): Promise<void> {
    await this.assertVisible(this.loginErrorMessage);
    await this.assertText(this.loginErrorMessage, 'Your email or password is incorrect!');
  }
}
