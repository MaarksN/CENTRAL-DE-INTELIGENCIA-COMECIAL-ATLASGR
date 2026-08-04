# Current Architecture

The current architecture is a monolithic React SPA (Vite) on the frontend, with an Express backend serving the API and static files, using Prisma ORM for PostgreSQL access. While functional, it exhibits coupling in some domains and lacks a formalized modular structure for enterprise scalability.