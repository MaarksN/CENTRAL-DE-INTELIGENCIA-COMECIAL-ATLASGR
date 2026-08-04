# Component Refactoring Audit - Onda 3

## Executive Summary
The React frontend is structurally sound, leveraging lazy loading at the route/app level (e.g., `App.tsx` lazy-loads `SinglePageDashboard`, `ProspectingHub`, `CrmBoard`, etc.). However, several key components have grown significantly in complexity and size, indicating a need for decomposition.

## Giant Components Identified

1. **`DecisionMakerSearch.tsx` (31,861 bytes)**
   - **Location:** `src/features/prospecting/components/prospecting-hub/DecisionMakerSearch.tsx`
   - **Issue:** This file is massive for a single UI component. It likely manages complex state, Apollo API integrations, rendering lists, and potentially side effects all in one file.
   - **Refactoring Plan:**
     - Extract API calls into custom hooks (e.g., `useDecisionMakerSearch()`).
     - Break down the UI into smaller components: `SearchFilters.tsx`, `ResultList.tsx`, `DecisionMakerCard.tsx`.
     - Implement React.memo for individual cards to prevent unnecessary re-renders of the entire list when a single card is interacted with.

2. **`DiscoveryFilterPanel.tsx` (19,834 bytes)**
   - **Location:** `src/features/prospecting/components/prospecting-hub/DiscoveryFilterPanel.tsx`
   - **Issue:** Large form and filter logic mixed with UI rendering.
   - **Refactoring Plan:**
     - Move the form validation (Zod) and state management (react-hook-form) into a dedicated hook.
     - Split complex select inputs into their own reusable components.

3. **`CandidateCard.tsx` (17,277 bytes)**
   - **Location:** `src/features/prospecting/components/prospecting-hub/CandidateCard.tsx`
   - **Issue:** Almost 17KB for a single list item card means it contains far too much inline logic (e.g., formatting, conditional rendering for enrichment states, fit scores, etc.).
   - **Refactoring Plan:**
     - Extract the "Fit Score" visualizer into a `FitScoreGauge.tsx` component.
     - Move enrichment and promotion logic out to context or hooks.
     - Wrap in `React.memo` as these cards are rendered in large lists during prospecting.

4. **`OcrCapturePanel.tsx` (12,339 bytes)**
   - **Location:** `src/features/prospecting/components/prospecting-hub/OcrCapturePanel.tsx`
   - **Issue:** Likely handles raw canvas/video input, file uploads, and heavy Tesseract.js interactions.
   - **Refactoring Plan:**
     - Separate the webcam/upload UI from the OCR processing logic.
     - Move OCR processing to a Web Worker (or backend) to unblock the main thread.

## State Management and Hooks
- The `SinglePageDashboard.tsx` correctly uses hooks like `useAnalytics` and `useActivities`.
- However, complex components still mix presentation and data fetching. The adoption of a structured presentation/container pattern (or custom hooks for all data fetching) is recommended for components over 500 lines of code.