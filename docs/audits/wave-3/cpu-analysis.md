# CPU Analysis - Onda 3

## Backend CPU Bottlenecks
1. **Local AI Inferencing:** If Ollama or `@xenova/transformers` runs on the same physical CPU as the Node web server, heavy embedding tasks or text generation will severely degrade the Express server's ability to respond to simple API requests.
2. **Synchronous Serialization:** Large JSON payloads returned from the DB (e.g. hundreds of Activities) block the V8 thread while `JSON.stringify` runs.
3. **Regex over large strings:** Markdown JSON extraction uses Regex on AI output. Ensure outputs are capped to prevent ReDoS (Regular Expression Denial of Service).

## Frontend CPU Bottlenecks
1. **Tesseract.js:** Running OCR in the browser is heavily CPU-bound. WebAssembly helps, but it will peg a mobile CPU at 100%. This must be offloaded to Web Workers.
2. **React Re-renders:** Large components like `SinglePageDashboard` will recalculate complex `useMemo` hooks or re-render child charts (`recharts`) if parent state changes without proper `React.memo` boundaries.