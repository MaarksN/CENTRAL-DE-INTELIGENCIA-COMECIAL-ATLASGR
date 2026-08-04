# Database Performance Audit - Onda 3

## Prisma Configuration & Connection Pooling
- **Current Setup:** The app utilizes Prisma (`v7.8.0`) with `@prisma/adapter-pg`, wrapped in a standard `pg` Pool configured with `max: 20` connections.
- **Analysis:** This is solid for a monolithic Express app. However, if the app starts running multiple worker threads or serverless functions, a dedicated external connection pooler (like PgBouncer or Prisma Accelerate) will be required to avoid exhausting DB connections.

## Indexes Audit
- Using `grep` on `schema.prisma`, most critical foreign keys and query lookups are indexed (`organizationId`, `cnpj`, `email`, `bitrixLeadId`).
- **Potential Bottlenecks:**
  - `@@index([organizationId, status])` on `Lead`: Good, but if querying by large date ranges (e.g., in dashboards), adding `createdAt` to this compound index (`[organizationId, status, createdAt]`) would speed up timeline and reporting queries.
  - Text search: Heavy text searches (like looking up companies by name or leads by notes) should not rely on basic Postgres `LIKE` or Prisma's native `.contains()`. Meilisearch integration is partially present (`searchQueue`), ensuring this is used universally for text-search endpoints is critical.

## Tenant Isolation Query Overhead
- **Current Setup:** Tenant isolation is enforced globally via a Prisma `$extends` query extension in `src/lib/prisma.ts`.
- **Performance Impact:** Every single database query passes through this Javascript-level proxy hook to append `organizationId`. While logically sound for security, intercepting every query at the ORM level adds CPU overhead in Node.js. Benchmarking the Prisma `$extends` versus standard service-layer filtering is recommended.