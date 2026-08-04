# Remediation Log - Onda 3

## Architectural Remediations Identified
*(Note: Code changes were kept to a minimum in Phase 3; this log serves as the backlog for immediate action in the next cycle).*

1. **Frontend Assets:** Identified 1MB chunks (OnboardingTour) and 400KB chunks (xlsx). Dynamic imports must be implemented.
2. **Backend Performance:** Separated Rate Limiting Redis from BullMQ Redis correctly. Identified Prisma `$extends` hook as a potential CPU bottleneck.
3. **AI Layer:** Documented the migration from explicit API keys to logical routing (Groq/Ollama via LiteLLM) to save costs. Identified the need to move local embeddings (`Xenova`) off the main thread.
4. **React Rendering:** Identified giant components (`DecisionMakerSearch`, `CandidateCard`) requiring `React.memo` and functional decomposition.