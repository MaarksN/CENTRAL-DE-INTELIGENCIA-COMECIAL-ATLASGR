# Embedding & RAG Architecture Audit - Onda 3

## Local Embeddings Implementation
- **Current Setup:** The system uses `@xenova/transformers` to run the `multilingual-e5-base` model entirely locally within the Node.js process (`src/lib/ai/local-embeddings.ts`).
- **Dimensions:** 768 dimensions, directly compatible with the PostgreSQL `vector(768)` setup (pgvector).
- **Pros:** Zero API costs, zero network latency, 100% data privacy (documents never leave the server).
- **Cons:** Loading the model (lazy load) takes significant time on the first run, and running heavy inferencing inside the Node event loop can block the single thread, negatively affecting Express server throughput.

## Improvement Strategy
- **Worker Offloading:** Move the execution of `obterExtrator()` and the actual embedding generation into a dedicated BullMQ worker or a Node.js `Worker_Thread`. Generating embeddings for a massive document (e.g., thousands of chunks) synchronously on the main thread will kill the server's ability to respond to web requests.
- **RAG Pipeline:** When performing vector similarity searches, ensure the system filters by `organizationId` BEFORE performing the cosine similarity calculation to ensure tenant isolation and drastically speed up the pgvector index lookup.