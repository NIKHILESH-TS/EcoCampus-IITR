---
name: uiux-designer
description: >-
  Expert UI/UX designer and design system specialist. Use when designing user interfaces,
  evaluating visual hierarchy, crafting design tokens, typography scales, responsive layouts,
  micro-interactions, and ensuring WCAG 2.1 AA accessibility compliance.
---

# UI/UX Designer Skill

A comprehensive design intelligence runbook to create clean, intuitive, accessible, and production-grade digital interfaces that avoid generic template cliches.

---

## 1. Core Design Principles

### A. Clarity Over Novelty
* Prioritize user comprehension. Controls must look like controls; buttons must have clear affordance; interactive elements must signal clickability.
* Maintain predictable information hierarchy: Title $\rightarrow$ Subtitle $\rightarrow$ Contextual Metadata $\rightarrow$ Primary Action $\rightarrow$ Secondary Action.

### B. Spatial Discipline & 8pt Grid System
* Base all layout dimensions, margins, paddings, and heights on an 8px grid (4px for micro-spacing):
  * `4px` (`gap-1`): Tight element binding (icon + label)
  * `8px` (`gap-2`, `p-2`): Related elements within a card
  * `12px` (`gap-3`): Medium separation between content blocks
  * `16px` (`p-4`, `space-y-4`): Standard card interior padding
  * `24px` (`gap-6`, `p-6`): Major section rhythm
  * `32px` - `48px`: Page-level whitespace

### C. Restraint in Color & Visual Weight
* **60-30-10 Rule:** 60% neutral background/canvas (`slate-50`, `white`), 30% structural contrast (`slate-900`, borders `slate-200`), 10% intentional accent (`emerald-600` for eco actions, `blue-600` for primary tenders, `amber-500` for warnings).
* Never saturate the entire canvas with decorative gradients. Accents should guide the eye to primary CTAs and status indicators.

---

## 2. Typography & Hierarchy Matrix

1. **Font Selection:** Use modern, legible sans-serif system fonts (`Inter`, `system-ui`, `-apple-system`, `Segoe UI`). Avoid decorative serif fonts for utility dashboards or dense productivity apps.
2. **Type Scale:**
   * **Display / Hero:** 24px - 32px (`text-2xl` - `text-3xl`), font-bold, tracking-tight.
   * **Section Header:** 16px - 18px (`text-base` - `text-lg`), font-semibold.
   * **Body Primary:** 13px - 14px (`text-sm`), font-normal, text-slate-800.
   * **Body Secondary / Captions:** 11px - 12px (`text-xs`), text-slate-500.
   * **Monospace Data / Badges:** 10px - 11px (`text-[10px]` - `text-[11px]`), font-mono, uppercase or padded pills.

---

## 3. Accessibility & Usability (WCAG 2.1 AA Standards)

* **Contrast Ratios:**
  * Normal text: At least **4.5:1** contrast ratio against its background.
  * Large text (18px+ bold or 24px+ regular): At least **3.0:1** contrast.
  * UI components & borders: At least **3.0:1** for interactive states.
* **Touch Target Size:** Minimum **44 × 44 pixels** for touch targets on mobile/tablet screens.
* **Semantic Roles:** Use native HTML elements (`<button>`, `<header>`, `<main>`, `<nav>`, `<input>`) instead of nested clickable `<div>` tags.
* **Color Independence:** Never use color alone to convey meaning (e.g. combine a green background with a checkmark icon or text label like "Active").

---

## 4. State Completeness Checklist

Every UI component must account for the 5 essential UX states:
1. **Ideal State:** Populated with standard, realistic data.
2. **Empty State:** Friendly illustration/icon, clear explanation of why it's empty, and a single prominent CTA to get started.
3. **Loading State:** Content-matched skeleton loaders (never abrupt white flashes or generic spinning rings).
4. **Partial State:** Single item or minimal data rendering cleanly without broken layouts.
5. **Error State:** Human-readable diagnosis, non-destructive recovery action (e.g. "Try again" button).
