import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Targeting: https://automationexercise.com — a publicly accessible e-commerce
 * demo site commonly used for QA practice. It covers auth, forms, and CRUD flows
 * that closely mirror real-world SaaS products like Careerflow.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,          // Run tests serially — avoids account conflicts
  forbidOnly: !!process.env.CI,  // Fail CI if test.only is accidentally committed
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
