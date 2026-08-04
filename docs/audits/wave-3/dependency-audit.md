# Dependency Audit - Onda 3

## Executive Summary
The `package.json` contains several large and potentially heavy dependencies that may not be strictly necessary for a core B2B CRM application.

## High Impact Dependencies
- **three** (`^0.185.1`) & **@react-three/drei** (`^10.7.7`): 3D rendering libraries are extremely heavy. Unless there is a specific 3D feature (e.g., interactive data visualization), these should be removed to save significant bundle size.
- **mammoth** (`^1.12.0`): Used for converting DOCX files. If this is only used server-side, it should not be in the client bundle.
- **tesseract.js** (`^7.0.0`): OCR library which is massive as it pulls in WebAssembly and language models. If OCR is not a core CRM feature or can be offloaded to the backend (or an external API), this should be removed or strictly lazy-loaded.
- **xlsx** (`^0.18.5`): This is a known heavy dependency (429.53 kB unminified in the Vite build). It should be replaced with lighter alternatives if only basic CSV/Excel export is needed, or lazy-loaded dynamically when the user requests an export.
- **recharts** (`^3.10.1`): Used for charting (339.47 kB bundle chunk). It's a standard choice, but ensuring it is only imported where charts are displayed (dynamic import) is key.
- **framer-motion** (`^12.42.2`): Heavy animation library (128.78 kB bundle chunk). Consider utilizing `LazyMotion` if animations are complex, or replacing simple animations with CSS.

## Recommendation
1. Remove `three` and `@react-three/drei` if not strictly required.
2. Ensure `xlsx`, `recharts`, and `tesseract.js` are dynamically imported (`const module = await import('xlsx')`) rather than statically imported at the top level.
3. Review OCR and Docx parsing features to see if they can be moved entirely to backend worker queues.