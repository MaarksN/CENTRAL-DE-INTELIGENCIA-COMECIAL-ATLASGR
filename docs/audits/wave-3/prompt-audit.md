# Prompt & LLM Evaluation Audit - Onda 3

## Prompt Engineering
- The system heavily utilizes JSON-constrained prompts (via `features.ts`).
- **Cost Danger:** Asking LLMs to return extensive data wrapped in JSON can bloat the output tokens significantly due to repetitive keys and syntax.
- **Optimization:** For extraction tasks, use specific `function_calling` or strict schema outputs supported natively by LiteLLM / OpenAI to reduce output token generation and improve parsing reliability, instead of relying purely on regex stripping (`extractJsonContent`).

## Cost Analysis
- By utilizing `local-llama3` (via Ollama or Groq) as the primary engine for standard workloads, the operational LLM cost is pushed toward compute infrastructure rather than API usage.
- If migrating to OpenRouter for scaling, strict Token Budgets per Tenant must be established in the `Organization` database model to prevent budget exhaustion.