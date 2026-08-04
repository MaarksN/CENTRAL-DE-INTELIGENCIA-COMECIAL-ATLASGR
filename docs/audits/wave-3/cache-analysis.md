# Cache Analysis - Onda 3

## Redis Usage
- **Rate Limiting:** Redis is correctly implemented for rate-limiting via a dedicated connection pool, preventing connection hangs.
- **Worker Queues:** BullMQ leverages Redis for robust job management.

## Application Caching Deficiencies
- **Data Enrichment Caching:** Memory notes indicate that data enrichment caching relies on checking the `enrichedAt` timestamp in the database (Prisma `Company` model) to skip redundant API calls. This means the DB is still queried.
  - **Improvement:** Implement an ephemeral Redis Cache for `Company` profiles (e.g., `company:profile:<cnpj>`) with a 24-hour TTL. This avoids hitting PostgreSQL entirely for hot leads.
- **API Response Caching:** Dashboard statistics (like `/api/analytics`) and heavy aggregations do not appear to have an explicit Redis caching layer, relying instead on database indexes.
  - **Improvement:** Implement HTTP-level caching (Redis-backed) for the `SinglePageDashboard` statistics endpoint with a short TTL (e.g., 60 seconds), drastically reducing DB load during heavy usage periods.