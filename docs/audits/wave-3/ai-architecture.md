# AI Architecture Audit - Onda 3

## Overview
The platform utilizes an abstraction layer over LiteLLM (via `src/lib/ai/gateway.ts`), enabling seamless switching between local models (Ollama) and cloud providers (Groq, OpenAI, Anthropic, OpenRouter).

## Current Setup & Findings

### Model Routing
- **Aliases:** Logical aliases (`local-llama3`, `local-llama3-fast`) are heavily utilized. `litellm-config.yaml` points these to a local Ollama instance (`http://host.docker.internal:11434`) by default.
- **Provider Fallbacks:** The gateway translates premium models (`gpt-4o`, `claude-sonnet`) to Groq's Llama-3 instances (`llama-3.3-70b-versatile`) if running through the `GROQ_MODEL_ALIASES` mapping.
- **Circuit Breakers:** `gateway.ts` correctly implements a memory-based circuit breaker (`CIRCUIT_FAILURE_THRESHOLD = 3`) to prevent hanging the application if an AI provider goes offline.

### AI Gateway Resiliency
- The AI Gateway implements a retry logic (`MAX_ATTEMPTS_PER_LEG = 3`) which specifically handles transient rate limits from Groq (e.g. 429 errors from hitting TPM limits). This is a well-designed resilience mechanism for the "swarm" architecture.

### Structured Output (JSON)
- `features.ts` demonstrates a mature approach to parsing LLM output: it requests strict JSON, extracts it using regex (cleaning markdown ticks), and validates it using `Zod`. If validation fails, it attempts a single repair loop by feeding the error back to the LLM.

## Improvement Opportunities
1. **Caching:** The AI layer lacks a semantic cache layer. Currently, exact or similar prompts will trigger full LLM executions. Implementing a Redis-backed semantic cache (e.g., using embeddings similarity threshold) would drastically cut API costs and latency.
2. **Telemetry/Observability:** While the `gateway.ts` logs actions, there is no evidence of tracking token usage per tenant or user. Given this is a B2B SaaS, attaching token metrics to tenant billing (or usage quotas) is critical.