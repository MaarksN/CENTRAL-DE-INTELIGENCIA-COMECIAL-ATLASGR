# Residual Risk & Technical Debt - Onda 3

1. **Prisma Middleware Overhead:** The global tenant isolation logic in Prisma intercepts every query. At thousands of requests per second, this JS proxying will consume significant CPU.
2. **Local AI Stability:** Relying on Ollama and local Xenova embeddings means the Node server's hardware is under immense compute pressure. If hardware is scaled down, AI tasks will timeout.
3. **Missing Pagination:** Several UI views lack strict server-side pagination, risking browser memory crashes as tenant data grows over months of usage.