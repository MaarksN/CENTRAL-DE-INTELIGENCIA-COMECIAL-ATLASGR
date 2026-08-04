# Backend Performance Audit - Onda 3

## Express Server Architecture
- **Current Setup:** `server.ts` uses Express with `helmet` for security and `compression` for Gzip.
- **Rate Limiting:** `express-rate-limit` is integrated with a dedicated `RedisStore`. Crucially, the implementation correctly separates the BullMQ Redis connection (which disables retries) from the Rate Limiting connection (which must fail fast to prevent hanging requests on the hot path). This is excellent.

## Request Pipeline Overhead
- Every authenticated request goes through `authenticateToken`, `requireTenant`, and sets up the asynchronous context (`requestContext`).
- **Improvement:** Ensure `async_hooks` (used by `AsyncLocalStorage` for `requestContext`) is not degrading performance at scale. It usually has a ~5% overhead in V8.

## Worker Queues (BullMQ)
- **Current Setup:** Heavy operations (`enrich.worker.ts`, `coldCall.worker.ts`, `agent.worker.ts`, etc.) are correctly offloaded to background workers via BullMQ in `src/lib/queue/`.
- **Improvement:** Verify worker concurrency limits. Heavy LLM jobs (`agent.worker`) can starve the Node event loop if concurrency is set too high without running in separate processes/threads.

## Conclusion
Backend structure is solid. To maximize throughput, the Node server should be clustered or run as multiple horizontally scaled pods in Kubernetes, relying on Redis for shared session/rate-limit state, which is already configured.