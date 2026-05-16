import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AccountDetails {
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
}

/**
 * RegistrationPage
 * The full account-detail form shown after a new user enters name + email.
 * Maps to the /signup route on automationexercise.com.
 */
export class RegistrationPage extends BasePage {
  readonly pageHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading         = page.locator('.login-form h2.title b');
    this.titleMrRadio        = page.locator('#id_gender1');
    this.passwordInput       = page.locator('[data-qa="password"]');
    this.firstNameInput      = page.locator('[data-qa="first_name"]');
    this.lastNameInput       = page.locator('[data-qa="last_name"]');
    this.addressInput        = page.locator('[data-qa="address"]');
    this.countryDropdown     = page.locator('[data-qa="country"]');
    this.stateInput          = page.locator('[data-qa="state"]');
    this.cityInput           = page.locator('[data-qa="city"]');
    this.zipcodeInput        = page.locator('[data-qa="zipcode"]');
    this.mobileInput         = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton      = page.locator('[data-qa="continue-button"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Fill all mandatory account-detail fields and submit */
  async completeRegistration(details: AccountDetails): Promise<void> {
    await this.titleMrRadio.check();
    await this.fillField(this.passwordInput, details.password);
    await this.fillField(this.firstNameInput, details.firstName);
    await this.fillField(this.lastNameInput, details.lastName);
    await this.fillField(this.addressInput, details.address);
    await this.countryDropdown.selectOption(details.country);
    await this.fillField(this.stateInput, details.state);
    await this.fillField(this.cityInput, details.city);
    await this.fillField(this.zipcodeInput, details.zipCode);
    await this.fillField(this.mobileInput, details.mobileNumber);
    await this.createAccountButton.click();
    // Wait for the confirmation screen to appear
    await this.page.waitForURL(/.*account_created.*/);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertOnRegistrationPage(): Promise<void> {
    await this.assertVisible(this.pageHeading);
    await this.assertText(this.pageHeading, 'Enter Account Information');
  }

  async assertAccountCreated(): Promise<void> {
    await this.assertVisible(this.accountCreatedHeading);
    await this.assertText(this.accountCreatedHeading, 'Account Created!');
  }
}
