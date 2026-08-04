# Memory Analysis - Onda 3

## Backend Memory Footprint
- **Local Embeddings (`@xenova/transformers`):** When the `multilingual-e5-base` model loads, it caches the weights in memory. This will consume approximately ~400MB to ~800MB of resident memory (RSS) in the Node process.
- **Prisma Client:** Prisma establishes a pool of 20 connections. Each connection and the query engine use memory. Expected footprint is ~150-300MB depending on query volume.
- **Node V8 Engine:** Standard garbage collection will handle API request memory, but long-running streams (like parsing giant DOCX/XLSX files) can cause memory spikes.
- **Total Backend Baseline:** ~800MB - 1.2GB per Node.js Pod.

## Frontend Memory Leaks
- **Giant Lists:** Rendering 500+ prospects without pagination or virtualization (e.g., `react-window`) will cause massive memory usage in the browser DOM, leading to tab crashes on mobile devices.
- **Canvas/Video:** The `OcrCapturePanel` must ensure it explicitly calls `.stop()` on media streams and clears canvas contexts, otherwise camera streams will cause memory leaks.