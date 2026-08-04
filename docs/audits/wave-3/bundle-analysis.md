# Bundle Analysis - Onda 3

## Build Output Metrics (Vite Production Build)

The Vite build for the frontend (`npm run build`) produced the following notable chunks:

- **dist/assets/OnboardingTour-*.js**: ~902.27 kB (244.18 kB gzip)
  - *Analysis:* Extremely large for a single feature. It likely bundles heavy assets, inline images, or heavy third-party step-by-step tour libraries.
- **dist/assets/xlsx-*.js**: ~429.53 kB (143.08 kB gzip)
  - *Analysis:* The `xlsx` library is massive. It must be dynamically imported only when an export/import action occurs.
- **dist/assets/CartesianChart-*.js**: ~339.47 kB (100.66 kB gzip)
  - *Analysis:* Likely related to `recharts`. Charts should be lazy-loaded (`React.lazy()`) in dashboard components.
- **dist/assets/vendor-react-*.js**: ~259.93 kB (83.71 kB gzip)
  - *Analysis:* Standard React + React DOM + React Router bundle.
- **dist/assets/IntelligenceHub-*.js**: ~132.51 kB (31.14 kB gzip)
  - *Analysis:* Large feature bundle. Needs investigation for potential component splitting.
- **dist/assets/vendor-motion-*.js**: ~128.78 kB (42.35 kB gzip)
  - *Analysis:* `framer-motion`. Suggest using `LazyMotion` to reduce the initial load if animations are not immediate.
- **dist/assets/zod-*.js**: ~105.30 kB (31.03 kB gzip)
  - *Analysis:* Standard validation library, but check if we can share this chunk more efficiently or if it's duplicated.
- **dist/assets/index-*.js (main app)**: ~66.71 kB (21.65 kB gzip)
- **dist/assets/ProspectingHub-*.js**: ~57.52 kB (14.78 kB gzip)
- **dist/assets/vendor-icons-*.js**: ~57.02 kB (11.45 kB gzip)
  - *Analysis:* `lucide-react` is likely tree-shaking correctly, but we should verify no wildcard imports are used (`import * as Icons from 'lucide-react'`).

## Warnings
- The Vite build explicitly warned: `(!) Some chunks are larger than 500 kB after minification.` specifically targeting the `OnboardingTour` chunk.

## Action Plan
1. Refactor `OnboardingTour` to use code-splitting for its internal steps or lazy-load it entirely.
2. Ensure `xlsx` and `recharts` are dynamically imported in their respective components.
3. Review `IntelligenceHub` for giant components that can be split.