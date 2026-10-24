---
name: code-reviewer
description: >-
  Systematic and rigorous code reviewer that audits code changes, pull requests,
  and architecture patterns for security vulnerabilities, logic bugs, performance
  bottlenecks, maintainability, and clean-code standards with classified severity (Critical, Warning, Nit).
---

# Code Reviewer Skill

A systematic, actionable code review runbook designed to enforce high engineering standards, prevent regressions, and catch security vulnerabilities before production deployment.

---

## 1. Severity Classification Framework

When conducting code reviews, classify all feedback into three distinct severity levels:

### 🔴 Critical (Blocker)
* **Definition:** Issues that cause runtime crashes, data loss, security vulnerabilities, memory leaks, severe performance degradation, or broken business logic.
* **Examples:** Unhandled Promise rejections in critical flows, SQL/XSS injections, hardcoded credentials, stale closures causing race conditions, unindexed N+1 queries.
* **Action:** Must be resolved before merge or deployment.

### 🟡 Warning (Important)
* **Definition:** Anti-patterns, maintainability issues, missing edge case handling, suboptimal algorithms, poor error reporting, or lack of test coverage.
* **Examples:** Missing cleanup in `useEffect`, improper dependency array, missing loading/error UI states, brittle CSS layout breaking at specific screen widths, hardcoded magic numbers.
* **Action:** Strongly recommended to resolve; document tradeoff if deferred.

### 🟢 Nit (Suggestion / Enhancement)
* **Definition:** Minor stylistic improvements, documentation enhancements, naming clarity, or micro-optimizations that do not impact functionality.
* **Examples:** Renaming a variable for higher semantic clarity, adding a JSDoc explanation, simplifying a ternary expression.
* **Action:** Optional; up to developer discretion.

---

## 2. Core Review Audit Checklist

### A. Correctness & Business Logic
1. **Edge Cases:** Are boundary values tested (empty array, null, 0, negative numbers, extreme inputs)?
2. **State Transitions:** Does the UI correctly handle `loading`, `success`, `empty`, and `error` states?
3. **Async / Concurrency:** Are race conditions handled if multiple network requests fire in quick succession?

### B. Security
1. **Secret Leakage:** Ensure zero API keys, auth tokens, or private secrets are committed in client code.
2. **Input Sanitization:** Verify that user-supplied input is sanitized and not rendered raw (`dangerouslySetInnerHTML`).
3. **Auth & Authorization:** Confirm permissions are verified server-side, not merely hidden in client UI.

### C. Performance & Resource Efficiency
1. **Re-render Discipline:** Avoid declaring inline functions or objects as props inside high-frequency loops.
2. **DOM / Memory Leaks:** Verify all event listeners (`window.addEventListener`), intervals, and WebSockets have matching cleanups in `useEffect` / `onDestroy`.
3. **Bundle Size:** Check for heavy dependency imports (e.g. importing the entirety of `lodash` instead of `lodash/debounce`).

### D. Architecture & Maintainability
1. **Single Responsibility:** Does each function/component do one thing well?
2. **Predictable State:** Is state hoisted to the right level, or is there prop drilling that should use a store/context?
3. **Type Safety / Contracts:** Are data payloads validated against expected schemas?

---

## 3. Review Output Template

When providing a review, format feedback clearly:

```markdown
### Summary of Changes
[1-2 sentences summarizing the architectural intent and scope of the code]

### Findings by Severity
- 🔴 **[Critical]** `path/to/file.ext#L42`: Description of crash/vulnerability + proposed concrete fix.
- 🟡 **[Warning]** `path/to/file.ext#L88`: Description of anti-pattern or missing edge-case + recommendation.
- 🟢 **[Nit]** `path/to/file.ext#L104`: Minor readability suggestion.

### Positive Highlights
- [Acknowledge elegant patterns, clean documentation, or thoughtful testing]
```
