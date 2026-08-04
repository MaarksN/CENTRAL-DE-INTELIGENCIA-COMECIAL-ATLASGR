# Benchmark: Before & After - Onda 3

*(Simulated Baseline based on Code Structure)*

| Metric | Before (Onda 2) | Expected After Optimization (Onda 3) |
| :--- | :--- | :--- |
| **Initial Bundle Size (JS)** | ~2.5 MB | ~800 KB (via lazy loading `xlsx`, `recharts`, `three`) |
| **Time to Interactive (TTI)** | ~4.5s | ~1.8s |
| **Dashboard DB Query Time** | ~300ms | ~50ms (with Redis HTTP caching) |
| **Lead Enrichment Cost** | ~$0.05 / lead | ~$0.0001 (Groq Llama 3) |
| **Local RAG Embedding Time** | Blocks Main Thread (Server lag) | Async Web Worker (Zero server lag) |
| **List Render FPS** | ~30 FPS on scroll | 60 FPS (via React.memo and virtualization) |