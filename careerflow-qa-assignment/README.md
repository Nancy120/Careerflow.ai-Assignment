# Careerflow.ai — QA Engineer Technical Assignment

> Submitted by: [Your Name]  
> Role: AI-Augmented QA Engineer  
> Date: May 2025

---

## Repository Structure

```
careerflow-qa-assignment/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI — runs tests on every push/PR
├── src/
│   └── pages/                     # Page Object Model classes
│       ├── BasePage.ts            # Abstract base — shared helpers
│       ├── HomePage.ts            # Landing page interactions
│       ├── SignupLoginPage.ts     # Auth page (signup + login forms)
│       ├── RegistrationPage.ts    # Full account detail form
│       └── AccountPage.ts        # Authenticated-user state
├── tests/
│   └── e2e/
│       └── authFlow.spec.ts      # Main E2E test suite
├── docs/
│   ├── test-plan.md              # Task 2 — AI Mock Interview test plan
│   └── ai-tools-usage.md        # AI tools reflection
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Task 1 — UI Automation (Playwright + TypeScript + POM)

### Application Under Test

**https://automationexercise.com** — a publicly accessible e-commerce demo site used widely in the QA community. It was chosen because:
- No authentication barriers for automated tests
- Covers realistic flows: registration, login, form validation, session state
- Mirrors the kind of auth + onboarding flow critical to any SaaS product like Careerflow

### Flow Automated

> **User Registration → Login → Authenticated Session → Logout**

This is the single most business-critical path in any SaaS product. At Careerflow, every feature (job tracker, resume builder, AI mock interviews) is gated behind authentication. A broken registration or login flow blocks all other features for new users — making this the highest-priority automation target.

### Test Cases Covered

| Test ID | Scenario | Type |
|---|---|---|
| TC-01 | Homepage loads with logo, hero, and products | Smoke |
| TC-02 | Clicking "Signup / Login" navigates to auth page | Navigation |
| TC-03 | New user registers → account confirmed → session active → logout | Happy path E2E |
| TC-04 | Login with invalid credentials shows error | Negative |
| TC-05 | Signup with an existing email shows an error | Negative |

### Prerequisites

- Node.js **v18+** (v20 recommended)
- npm **v9+**

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/careerflow-qa-assignment.git
cd careerflow-qa-assignment

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run a specific test file
npx playwright test tests/e2e/authFlow.spec.ts

# Run with debug mode (step through)
npm run test:debug

# View the HTML report after a run
npm run test:report
```

### Tools and Versions

| Tool | Version |
|---|---|
| Playwright | ^1.44.0 |
| TypeScript | ^5.4.5 |
| Node.js | 20.x (CI) |
| Browsers | Chromium, Firefox |

### Design Decisions

- **Page Object Model (POM):** All selectors and interactions are encapsulated in page classes under `src/pages/`. Tests import page objects, not raw Playwright locators — making tests readable and selectors easy to update in one place.
- **No hardcoded waits:** All synchronisation uses Playwright's built-in `waitForURL`, `waitForLoadState`, and `expect` auto-waiting. `page.waitForTimeout()` is deliberately absent.
- **BasePage abstraction:** Shared utilities (`fillField`, `assertVisible`, `assertUrlContains`) live in `BasePage.ts` so individual page classes stay DRY.
- **Unique email per run:** A `Date.now()` timestamp is appended to test emails so each CI run creates a fresh account — no test pollution.
- **Clean-up:** TC-03 deletes the test account at the end, keeping the site tidy and enabling the same email pattern to be reused.
- **TypeScript throughout:** Provides compile-time safety on locator types and function signatures — catches refactor errors before runtime.

### Assumptions

- `automationexercise.com` is accessible from the CI runner (no geo-blocking)
- The site's DOM structure matches the `data-qa` attribute selectors used in the test (verified manually at time of writing)
- The site allows programmatic account creation without CAPTCHA on the registration form

### CI/CD

Tests run automatically on every push to `main` or `develop`, and on every pull request to `main`, via GitHub Actions (`.github/workflows/playwright.yml`). The HTML test report is uploaded as a downloadable artifact on each run, even on failure.

---

## Task 2 — Test Scenario Design: AI Mock Interview Platform

The full test plan is in **[docs/test-plan.md](./docs/test-plan.md)**.

### Quick Summary

- **15 detailed test cases** covering: happy path, edge cases, negative scenarios, integration failures, and session/state management
- **3 critical test cases** identified with explicit business-impact reasoning (session start, feedback generation, session summary)
- **4 documented assumptions and risks** in the absence of a full PRD
- **Bonus section:** A structured rubric for evaluating AI feedback quality, including golden-set evaluation, user feedback loops, and prompt regression testing

---

## AI Tools Usage

Full reflection is in **[docs/ai-tools-usage.md](./docs/ai-tools-usage.md)**.

**TL;DR:**
- Used **Claude** to stress-test edge case coverage for the AI Mock Interview test plan — it surfaced the "consistency" and "hallucination" dimensions I hadn't initially prioritised
- Used **GitHub Copilot** for inline boilerplate in POM classes
- **Overrode the AI** when it suggested a 2-second SLA for AI feedback (unrealistic for LLM inference) and when it generated duplicate test cases — both required human judgment to correct
- Core insight: AI tools are best used to challenge your own coverage thinking, not to replace it

---

## Contact

Questions about this submission? Reach out at: [your.email@example.com]
