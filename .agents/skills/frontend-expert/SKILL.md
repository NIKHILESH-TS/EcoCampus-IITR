---
name: frontend-expert
description: >-
  Elite frontend engineer specialized in modern web development, React 18/19, Tailwind CSS,
  component architecture, state machines, Core Web Vitals, and anti-AI-slop design execution.
---

# Frontend Expert Skill

A senior frontend engineering guide dedicated to building fast, maintainable, responsive, and robust modern web applications.

---

## 1. Fighting "AI Slop" & Generic Aesthetics

AI coding tools often generate bland, cookie-cutter frontends characterized by:
* Cliché floating cards with heavy blur gradients (`bg-gradient-to-r from-purple-500 to-indigo-600`)
* Oversized centered hero cards that push real content below the fold
* Inconsistent font sizes and haphazard margin choices
* Fragile fixed widths that break on mobile screens

### The Frontend Expert Standards:
1. **Utility-First Restraint:** Clean, light backgrounds (`bg-slate-50`), structured containers (`max-w-7xl mx-auto px-4 sm:px-6`), and crisp 1px borders (`border-slate-200`).
2. **Dense, Usable Information Architecture:** Prioritize scanning density; display key metrics and actions above the fold.
3. **Intentional Accents:** Restrict saturated colors to badges, CTA buttons, and status alerts.

---

## 2. React Architecture & Performance Best Practices

### A. Re-render Boundaries
* Isolate high-frequency state (e.g. countdown timers, search inputs) into leaf components so re-renders do not invalidate the entire dashboard.
* Use `useCallback` and `useMemo` strictly when reference stability is needed for heavy child components or effect dependencies.

### B. Clean Event & Store Subscription Patterns
```javascript
// Reliable subscription pattern for local or window event buses
useEffect(() => {
  const handler = () => loadData();
  handler(); // Initialize immediately
  window.addEventListener('app_state_change', handler);
  return () => window.removeEventListener('app_state_change', handler);
}, []);
```

### C. State Machine Discipline
* Group interdependent state variables to eliminate impossible states:
  ```javascript
  // Bad: Can accidentally be both loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Good: Single status enum
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  ```

---

## 3. Tailwind CSS Master Patterns

1. **Responsive Modifiers:** Always construct layouts **mobile-first**:
   * `flex flex-col sm:flex-row`: Stack on mobile, side-by-side on tablet/desktop.
   * `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`: Dynamic reflow.
2. **Interactive States:** Provide instant visual feedback for all interactive elements:
   * `hover:bg-slate-100 active:scale-98 transition-all`
   * `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden`
3. **Typography Scaling:**
   * Pair labels with monospace data: `<span className="font-mono font-bold text-slate-900">₹450</span>`

---

## 4. Production Build & Core Web Vitals Optimization

1. **LCP (Largest Contentful Paint):** Preload primary visual assets; avoid blocking network requests before initial paint.
2. **CLS (Cumulative Layout Shift):** Always specify explicit `width` and `height` (or aspect-ratio classes like `aspect-video`, `h-48 w-full object-cover`) on image containers so space is reserved before images load.
3. **INP (Interaction to Next Paint):** Keep event handlers lightweight. Delegate heavy calculations to Web Workers or schedule them using `requestAnimationFrame` / `setTimeout`.
