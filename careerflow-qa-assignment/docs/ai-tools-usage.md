# AI Tools Usage — Honest Reflection

## Tools Used

| Tool | Primary Use in This Assignment |
|---|---|
| **Claude (Anthropic)** | Test case generation brainstorming, rubric design for AI quality testing, reviewing edge case coverage gaps |
| **GitHub Copilot** | Inline code suggestions while writing POM classes and Playwright assertions |

---

## Specific Examples

### 1. Generating Edge Cases for the AI Feedback Feature (Claude)
When writing the test plan for the AI Mock Interview Platform, I asked Claude:  
*"What are the edge cases that are commonly missed when testing AI-generated feedback in a user-facing product?"*

Claude surfaced several I hadn't initially considered — particularly the **consistency dimension** (same input → similar score across repeated calls) and the **hallucination risk** in feedback text. These became TC-IMI-012 and an entire quality-rubric section in the test plan.

### 2. Boilerplate POM Structure (GitHub Copilot)
While scaffolding the `BasePage.ts` class, Copilot auto-completed the `fillField` method with a standard `clear() + fill()` pattern. This saved time and was directly usable.

---

## One Example Where AI Was Useful

**Claude's suggestion on AI quality testing** was genuinely insightful. I asked it how QA teams evaluate non-deterministic AI output, and it articulated the concept of a "golden set evaluation" with score-drift thresholds. I hadn't seen this framed that way before, and it improved the quality-assurance section significantly beyond what I would have written from scratch.

---

## One Example Where I Had to Override the AI

When I asked Claude to generate the 15 test cases directly in table format, it initially included several **duplicate scenarios** (two variants of the empty-answer case, two login tests that were nearly identical). It also suggested testing "response time is under 2 seconds" for the AI feedback — which is unrealistic given typical LLM inference latency. I overrode that to a more defensible **10-second threshold** and merged the duplicates into single, more comprehensive test cases. The AI gave a useful starting scaffold, but the final test case quality required human judgment to refine.

---

## Reflection

AI tools are accelerators, not replacements, for QA thinking. The highest-value use I found was using Claude to **stress-test my own coverage** — asking "what am I missing?" rather than "write the tests for me." The output still needed domain expertise to filter, calibrate, and make realistic. Copilot was most useful for boilerplate; it struggled with context-specific assertions that required knowing the app's actual DOM structure. The practical workflow is: AI for speed and breadth → human for judgment and depth.
