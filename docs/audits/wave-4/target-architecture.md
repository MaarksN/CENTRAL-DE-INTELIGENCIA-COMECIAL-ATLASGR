# Target Architecture

The target architecture is a Modular Monolith.

Key characteristics:
- Strict boundaries between domains.
- Clean Architecture implementation (Controllers, Use Cases, Repositories).
- Dependency Injection for loose coupling.
- AI Gateway for centralized LLM management.
- Event-driven patterns for internal communication (e.g., BullMQ for async jobs).