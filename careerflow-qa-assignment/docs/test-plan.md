# Test Plan: AI Mock Interview Platform
**Product:** Careerflow.ai — AI Mock Interview Feature  
**Document Version:** 1.0  
**Author:** QA Engineer Candidate  
**Date:** May 2025  
**Status:** Draft (based on feature description; no PRD available)

---

## 1. Feature Overview

The AI Mock Interview Platform allows users to:
- Practice job-specific interview questions
- Receive AI-generated feedback on their spoken/written answers
- Track improvement across multiple sessions over time

This test plan covers **functional testing, edge cases, integration points, regression risk areas,** and a dedicated section on **AI output quality assurance**.

---

## 2. Scope

### In Scope
- Interview session creation and configuration
- Question delivery (by role/domain)
- User answer submission (text and/or audio)
- AI feedback generation and display
- Progress tracking and session history
- Authentication and authorisation gating
- Third-party integrations (AI model API, storage, analytics)

### Out of Scope
- Payment/subscription flows (covered by billing test plan)
- Job board/tracker features unrelated to mock interviews
- Infrastructure/load testing (separate performance plan)

---

## 3. Test Approach

| Phase | Technique | Tooling |
|---|---|---|
| Functional | Manual + Automated E2E | Playwright |
| API | Contract + integration tests | Postman / Playwright API |
| AI Quality | Structured rubric evaluation | Manual panel review |
| Regression | Automated smoke suite on every deploy | Playwright + GitHub Actions |
| Exploratory | Session-based, 60-min charters | Manual |
| Accessibility | WCAG 2.1 AA audit | axe-core + manual |

---

## 4. Test Cases

| Test ID | Description | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-IMI-001** | Start a new mock interview session with a valid role | User logged in; at least one interview role available | 1. Navigate to Mock Interview section  2. Select "Software Engineer" role  3. Click "Start Interview" | Session begins; first question is displayed within 3 s; timer starts if applicable | 🔴 Critical |
| **TC-IMI-002** | Submit a valid text answer and receive AI feedback | Active interview session open; first question displayed | 1. Read displayed question  2. Type a complete answer (>50 chars)  3. Click "Submit" | AI feedback is generated and shown within 10 s; feedback contains at minimum: score, strengths, areas to improve | 🔴 Critical |
| **TC-IMI-003** | Complete a full interview session and view summary | User in active session with ≥3 questions answered | 1. Answer all questions in the session  2. Click "Finish Interview" | Session summary screen shows: overall score, per-question breakdown, actionable tips, option to retake | 🔴 Critical |
| **TC-IMI-004** | Track improvement across two sessions | User has completed at least one previous session for same role | 1. Complete a second session for the same role  2. Navigate to "My Progress" | Progress dashboard shows comparison of Session 1 vs Session 2 scores; trend graph visible; delta is calculated correctly | 🔴 Critical |
| **TC-IMI-005** | Submit an empty answer | Active interview session; question displayed | 1. Leave answer field blank  2. Click "Submit" | Validation error displayed ("Answer cannot be empty"); no API call made; user stays on question | 🟠 High |
| **TC-IMI-006** | Submit an extremely short / low-quality answer | Active session open | 1. Type "I don't know" (4 words) and submit | AI feedback generated; feedback specifically acknowledges the brevity and guides the user to provide more detail; no system crash | 🟠 High |
| **TC-IMI-007** | Submit an answer exceeding the character limit | Active session; input field with max character constraint | 1. Paste 10,000-character text into answer box  2. Attempt to submit | Input is capped at the defined limit OR an error is shown; system handles gracefully without hanging or 500 error | 🟠 High |
| **TC-IMI-008** | AI feedback API timeout — graceful degradation | Active session; AI service is intentionally delayed (mocked at 30 s+) | 1. Submit a valid answer  2. Wait | User sees a loading indicator; after threshold (e.g. 15 s), a user-friendly error message appears; user is offered a "Retry" button; session state is preserved | 🟠 High |
| **TC-IMI-009** | Unauthenticated user cannot access the interview feature | User is logged out | 1. Navigate directly to `/mock-interview/start` | User is redirected to login page; no interview data is exposed; no 401 JSON error shown to user | 🟡 Medium |
| **TC-IMI-010** | Session data persists across browser refresh | User has answered 2/5 questions | 1. Answer 2 questions  2. Refresh the page | Session state is restored (progress preserved); user is returned to the current question or offered to resume | 🟡 Medium |
| **TC-IMI-011** | Interview question set is role-specific | Two active sessions: one "Product Manager", one "Data Analyst" | 1. Start "Product Manager" session  2. Note questions  3. Start "Data Analyst" session | Questions differ between roles; no role-irrelevant questions appear (e.g. SQL questions in a PM session) | 🟡 Medium |
| **TC-IMI-012** | Offensive / irrelevant input in answer field | Active session open | 1. Type profanity or completely off-topic content and submit | AI feedback either handles gracefully (notes irrelevance) or a content-moderation layer blocks it; no raw model output or stack trace exposed | 🟡 Medium |
| **TC-IMI-013** | Progress dashboard reflects deleted sessions accurately | User with 3 sessions; one session is deleted | 1. Delete one session from history  2. Reload progress dashboard | Dashboard recalculates averages correctly without the deleted session; no orphaned data displayed | 🟡 Medium |
| **TC-IMI-014** | Audio answer submission (if voice input supported) | Session open; microphone permission granted | 1. Click "Record Answer"  2. Speak for 30 s  3. Stop and submit | Audio is transcribed; transcript shown to user for review; AI feedback is generated from transcript; accuracy of transcription noted | 🟡 Medium |
| **TC-IMI-015** | Concurrent session prevention | Same user account open in two browser tabs | 1. Start session in Tab A  2. Attempt to start a session in Tab B | Either Tab B shows a warning ("Session already in progress") or a new session is cleanly started and Tab A is invalidated; no data corruption | 🟡 Medium |

---

## 5. Three Most Critical Test Cases and Rationale

### 🔴 TC-IMI-001 — Start a Mock Interview Session
**Why it's critical:**  
This is the entry gate to the entire feature. If a session cannot be started, 100% of the feature is blocked for all users. It tests the integration between the frontend, the question-bank service, and session state management simultaneously. Any failure here means zero value delivered.

### 🔴 TC-IMI-002 — Submit Answer and Receive AI Feedback
**Why it's critical:**  
This is the core value proposition. The user submits an answer → the AI service is called → feedback is rendered. It tests three systems at once: the answer submission API, the AI model integration, and the feedback rendering UI. A failure or a degraded response (e.g., blank feedback, garbled text) directly destroys user trust and represents a complete product failure.

### 🔴 TC-IMI-003 — Complete Session and View Summary
**Why it's critical:**  
The summary screen is what converts a one-time user into a returning user — it delivers the measurable outcome of the session. Bugs here (wrong scores, missing data, broken layout) will prevent users from understanding their results and kill retention. It is also the most complex orchestration point, assembling data from multiple answered questions into a single coherent view.

---

## 6. Risks and Assumptions

Since no full PRD is available, the following assumptions and associated risks apply:

| # | Assumption | Risk if Assumption is Wrong |
|---|---|---|
| 1 | AI feedback is generated in near-real time (<10 s) | If feedback is asynchronous (queued, batch-processed), the entire feedback-display test strategy needs to change; tests will time out | 
| 2 | The question bank is static/pre-curated per role, not dynamically generated per user | If questions are LLM-generated per session, test cases for "role specificity" (TC-IMI-011) become non-deterministic and require a different validation approach |
| 3 | Users have a "free tier" with limited sessions and a "paid tier" with unlimited sessions | If no tier gating exists, entitlement/paywall tests are unnecessary; if it does exist, we are missing an entire permission-matrix test suite |
| 4 | The app is web-only (no native mobile app) at launch | If a mobile app exists, we need a separate Appium/Detox plan and the UI test coverage here is insufficient |

**Additional Risk:** AI model versions may be updated silently (no deployment flag), causing feedback quality regressions that are invisible to automated tests — only caught by ongoing human review panels.

---

## 7. Bonus: Testing AI Feedback Quality

### What Does "Good AI Output" Mean in a QA Context?

Testing AI-generated feedback is fundamentally different from testing deterministic software. The output is probabilistic, so traditional pass/fail assertions are insufficient. Instead, QA must evaluate against a **rubric of quality dimensions**:

#### 7.1 Quality Dimensions

| Dimension | Definition | Test Method |
|---|---|---|
| **Relevance** | Feedback addresses the actual question asked, not a generic prompt | Human review panel: rate 1–5 per session; flag sessions where feedback references a different role/topic |
| **Specificity** | Feedback cites specific content from the user's answer | Check that feedback contains paraphrased quotes or direct references to the answer text |
| **Accuracy** | Factual claims in the feedback are correct (e.g. STAR method explanation, interview tips) | Subject-matter expert review for each question domain |
| **Actionability** | Feedback includes at least one concrete improvement suggestion | Automated: assert feedback body contains ≥1 bullet from the "areas to improve" section |
| **Consistency** | Similar answers to the same question produce broadly similar scores (within ±10%) | Regression test: submit the same answer 5 times; compare score variance |
| **Tone** | Feedback is constructive, not discouraging or overly effusive | Sentiment analysis tool (e.g. VADER) to flag extreme polarity in feedback |
| **Non-hallucination** | Feedback does not invent job titles, companies, or technical standards | Expert spot-check on 10% of sessions weekly |

#### 7.2 Practical QA Process for AI Quality

1. **Golden Set Evaluation:** Maintain a curated set of 20–30 benchmark answers (strong, average, weak) per role. On every AI model update, re-run these and compare scores to the baseline. A >10% drift triggers a review gate before the update ships.

2. **User Feedback Loop:** Instrument the UI with a thumb-up / thumb-down on each AI feedback card. Track thumbs-down rate by role and question type. A spike in negative ratings is an automated quality alert.

3. **Prompt Regression Suite:** Treat the AI system prompt as code — version-control it and run a diff-based test whenever it changes. Any prompt change requires re-running the golden set evaluation.

4. **Edge Case Adversarial Inputs:** Submit intentionally bad answers ("aaaaa", lorem ipsum, code snippets) and verify the AI handles them gracefully — useful feedback or a clean "insufficient answer" message, never a hallucinated positive review.

---

## 8. Integration Points and Regression Risk Areas

| Integration | Regression Risk | Mitigation |
|---|---|---|
| AI Model API (OpenAI / Anthropic / internal) | Model version changes can silently alter output quality | Golden set evaluation on every model update |
| Authentication / Session service | Token expiry mid-interview could orphan session data | Test token refresh during active session; test re-authentication flow |
| Question Bank / CMS | Content updates may break question format assumptions | Schema validation test on every CMS deploy |
| Progress/Analytics store | Miscalculated aggregates affect trust in progress data | DB-level assertion tests on score computation logic |
| Speech-to-Text API (if voice input) | Transcription errors propagate directly into AI feedback | Accuracy benchmarks using known audio clips |

---

*End of Test Plan v1.0*
