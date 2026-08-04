# Roadmap Post-Onda 3

### Immediate Actions (Next Sprint)
1. **Frontend Refactoring:** Implement `React.lazy()` for `xlsx`, `recharts`, and `tesseract.js`.
2. **Worker Isolation:** Move `@xenova/transformers` to a dedicated BullMQ worker.
3. **Redis Caching:** Implement HTTP endpoint caching for `/api/analytics`.

### Mid-Term Goals (Next Quarter)
1. **Meilisearch Integration:** Move all text-based filtering out of Prisma and into Meilisearch.
2. **Virtualization:** Implement `react-window` for all CRM boards and tables.

### Long-Term Vision
1. **Dedicated AI Microservice:** Move LiteLLM and local Ollama/Embeddings to a separate Python/Go microservice to completely free the Node.js event loop.