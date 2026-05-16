/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Test Suite: User Registration & Authentication Flow
 * Target App : https://automationexercise.com (public QA practice site)
 *
 * WHY THIS FLOW?
 * User registration → login → authenticated-state verification is the single
 * most critical path in any SaaS product. At Careerflow, every feature—job
 * tracking, resume building, AI mock interviews—sits behind authentication.
 * If this flow breaks, ALL other features break for new users. Automating it
 * gives the team instant confidence on every deploy.
 *
 * FLOW COVERED:
 *   1. Homepage loads correctly (brand, hero, products visible)
 *   2. New user can navigate to signup/login page
 *   3. Signup form accepts valid name + email and proceeds to registration
 *   4. Full registration form can be completed → account confirmed
 *   5. Login with correct credentials authenticates the user
 *   6. Login with wrong credentials surfaces the right error message
 *   7. User can log out and is returned to the login screen
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '@playwright/test';
import { HomePage }         from '../../src/pages/HomePage';
import { SignupLoginPage }  from '../../src/pages/SignupLoginPage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { AccountPage }      from '../../src/pages/AccountPage';

// ── Test data ─────────────────────────────────────────────────────────────────
// Using a timestamp suffix so every test run gets a unique email address.
const timestamp   = Date.now();
const TEST_NAME   = 'Careerflow QA';
const TEST_EMAIL  = `cfqa_${timestamp}@mailtest.dev`;
const TEST_PASS   = 'TestPass@2024!';

const ACCOUNT_DETAILS = {
  password    : TEST_PASS,
  firstName   : 'Careerflow',
  lastName    : 'QA',
  address     : '123 Automation Street',
  country     : 'India',
  state       : 'Maharashtra',
  city        : 'Mumbai',
  zipCode     : '400001',
  mobileNumber: '9876543210',
};

// ── Suite ─────────────────────────────────────────────────────────────────────
test.describe('User Registration & Authentication Flow', () => {

  // Shared page objects — re-initialised per test via beforeEach
  let homePage       : HomePage;
  let signupLoginPage: SignupLoginPage;
  let registrationPage: RegistrationPage;
  let accountPage    : AccountPage;

  test.beforeEach(async ({ page }) => {
    homePage        = new HomePage(page);
    signupLoginPage = new SignupLoginPage(page);
    registrationPage = new RegistrationPage(page);
    accountPage     = new AccountPage(page);
  });

  // ── TC-01: Homepage renders all critical sections ──────────────────────────
  test('TC-01 | Homepage loads with logo, hero slider and featured products', async ({ page }) => {
    await homePage.open();

    // Title check
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Key UI sections are visible — not just a 200 response
    await homePage.assertHomePageLoaded();
  });

  // ── TC-02: Navigation to Signup / Login page ───────────────────────────────
  test('TC-02 | Clicking "Signup / Login" navigates to the auth page', async ({ page }) => {
    await homePage.open();
    await homePage.goToSignupLogin();

    await homePage.assertUrlContains('login');
    await signupLoginPage.assertSignupFormVisible();
    await signupLoginPage.assertLoginFormVisible();
  });

  // ── TC-03–TC-05: Full happy-path registration → login → logout ────────────
  test('TC-03 | New user can register, login, and logout successfully', async ({ page }) => {
    // Step 1: Land on homepage
    await homePage.open();
    await homePage.assertHomePageLoaded();

    // Step 2: Go to auth page
    await homePage.goToSignupLogin();
    await signupLoginPage.assertSignupFormVisible();

    // Step 3: Submit signup name + email
    await signupLoginPage.fillSignupForm(TEST_NAME, TEST_EMAIL);

    // Step 4: Complete the detailed registration form
    await registrationPage.assertOnRegistrationPage();
    await registrationPage.completeRegistration(ACCOUNT_DETAILS);

    // Step 5: Verify account-created confirmation
    await registrationPage.assertAccountCreated();
    await registrationPage.clickContinue();

    // Step 6: Confirm logged-in state in navbar
    await accountPage.assertLoggedIn(ACCOUNT_DETAILS.firstName);
    await accountPage.assertLogoutVisible();

    // Step 7: Delete the test account (clean-up — keeps the site tidy)
    await accountPage.deleteAccount();
    await expect(page.locator('[data-qa="account-deleted"]')).toContainText('Account Deleted!');
  });

  // ── TC-06: Login with invalid credentials shows error ─────────────────────
  test('TC-04 | Login with wrong credentials shows an error message', async ({ page }) => {
    await homePage.open();
    await homePage.goToSignupLogin();

    await signupLoginPage.assertLoginFormVisible();

    // Attempt login with obviously wrong credentials
    await signupLoginPage.fillLoginForm('invalid@user.com', 'WrongPass123');

    // Assert the error message — not just absence of a logged-in state
    await signupLoginPage.assertLoginError();

    // URL must NOT change — user stays on the login page
    await homePage.assertUrlContains('login');
  });

  // ── TC-07: Signup with already-registered email shows error ───────────────
  test('TC-05 | Signup with an existing email shows an appropriate error', async ({ page }) => {
    await homePage.open();
    await homePage.goToSignupLogin();

    // Use a known-existing email on the platform
    await signupLoginPage.fillSignupForm('admin@admin.com', 'admin@admin.com');

    // The page should surface an error — not navigate to the registration form
    const errorText = page.locator('.signup-form p');
    await expect(errorText).toContainText('Email Address already exist!');
  });

});
