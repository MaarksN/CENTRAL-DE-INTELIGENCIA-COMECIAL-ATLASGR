# Architecture Certification
## Architecture Compliance Specialist

- Confirmed strict adherence to Clean Architecture.
- Controllers orchestrate Use Cases; Use Cases depend purely on Interfaces.
- Manual DI container (`src/shared/di/container.ts`) correctly prevents singletons and manages lifecycles.
- Prisma ORM is strictly isolated within the Infrastructure layer via the Repository pattern.