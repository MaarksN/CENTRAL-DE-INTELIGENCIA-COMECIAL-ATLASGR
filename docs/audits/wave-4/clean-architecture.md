# Clean Architecture Audit

Findings:
- Direct Prisma access found in some application layers; must be refactored to use Repositories.
- Controllers often contain business logic.

Actions:
- Enforce strict separation: `Presentation (Controllers)` -> `Application (Use Cases)` -> `Domain (Entities/Interfaces)` <- `Infrastructure (Repositories/Services)`.