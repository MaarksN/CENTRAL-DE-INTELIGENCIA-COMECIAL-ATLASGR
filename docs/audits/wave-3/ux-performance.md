# UX Performance Audit - Onda 3

## Overview
UX performance focuses on the perceived speed, responsiveness, and fluidity of the application from the user's perspective.

## Findings & Recommendations

### 1. Perceived Loading Times
- **Current State:** The app uses a generic `PageFallback` skeleton during lazy-load transitions. While functional, it flashes a generic layout before the specific page layout loads.
- **Improvement:** Implement feature-specific skeleton loaders (e.g., `DashboardSkeleton`, `KanbanSkeleton`) to match the structural layout of the destination page, reducing layout shift (CLS) and improving perceived performance.

### 2. Feedback on Heavy Operations
- **Current State:** The `ProspectingHub` contains heavy operations (AI discovery, OCR). While there are loading steps defined (`loadingSteps`), the UI might freeze if synchronous heavy processing occurs (like Tesseract OCR or large data sorting).
- **Improvement:** Ensure all heavy operations are completely asynchronous. Use progress bars with deterministic (or simulated deterministic) advancement rather than infinite spinners for operations taking longer than 2 seconds (e.g., Prospecting searches).

### 3. Animations & Fluidity
- **Current State:** `framer-motion` is used for fluid transitions. The `MainLayout` has complex absolute positioning and blur filters for background effects.
- **Improvement:**
  - Complex blurs (`blur-[120px]`) and large absolute positioned elements can cause GPU painting bottlenecks on lower-end devices. Test `will-change: transform` or reduce the blur radius on mobile/low-end devices.
  - Optimize list animations (e.g., Kanban boards and Activity lists) to ensure they hit 60 FPS by avoiding animating expensive CSS properties (stick to `transform` and `opacity`).

### 4. Layout Shifts (CLS)
- **Current State:** The transition between states (empty state -> loading -> data populated) in the Dashboard and CRM boards needs auditing.
- **Improvement:** Ensure fixed heights/min-heights are set for widget containers (`LiveStatsWidget`, `ClockCalendarWidget`) to prevent the page from jumping when data arrives from the API.