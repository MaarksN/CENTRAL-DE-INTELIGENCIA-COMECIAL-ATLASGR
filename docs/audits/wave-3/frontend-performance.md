# Frontend Performance Audit - Onda 3

## Rendering Strategy & Lazy Loading
- **Current State:** The application utilizes `React.lazy()` and `<Suspense>` extensively in `App.tsx` for route-level code splitting. This is excellent for initial load performance.
- **Improvement:** While route-level splitting is good, feature-level splitting is lacking. Heavy libraries like `three`, `recharts`, and `xlsx` are imported synchronously inside their respective modules. These should be dynamically imported at the component level to prevent bloating the feature chunks (e.g., `IntelligenceHub` and `OnboardingTour`).

## Re-render Optimization
- **Current State:** Components like `CandidateCard` and `DecisionMakerSearch` are rendered in large lists. There is no visible evidence of widespread `React.memo` usage to prevent re-renders when parent states change.
- **Improvement:**
  - Apply `React.memo` to list items (`CandidateCard`, `CnpjResultCard`).
  - Use `useMemo` for complex data sorting (e.g., `sortedAgenda` in `SinglePageDashboard`).
  - Use `useCallback` for event handlers passed down to deeply nested children.

## Bundle Impact on Performance
- The `OnboardingTour` chunk is almost 1MB unminified. This creates a severe performance bottleneck during initial user onboarding. It must be refactored to lazy-load its heavy internal assets or steps.
- `framer-motion` is bundled globally. Implementing `LazyMotion` combined with `domAnimation` can cut ~128KB from the initial JS payload.

## Main Thread Blocking (CPU)
- The inclusion of `tesseract.js` for OCR directly in the browser can severely block the main thread and freeze the UI during processing.
- **Improvement:** Move OCR processing to the backend via an API queue (BullMQ), or at minimum, execute Tesseract.js inside a dedicated Web Worker.