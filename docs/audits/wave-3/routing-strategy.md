# Routing Strategy Audit - Onda 3

## Current Strategy
The system uses `usage-based-routing` via LiteLLM (`litellm-config.yaml`). Fallbacks are strictly defined:
- `local-llama3` -> `local-llama3-fast`
- `gpt-4o` -> `local-llama3`
- `claude-sonnet` -> `local-llama3`

## Cost/Performance Routing Matrix Recommendation

To optimize performance and cost simultaneously, the AI orchestration should implement "Task-Based Routing":

1. **Tier 1: Fast / Trivial Tasks (Categorization, Simple Parsing)**
   - **Target:** `local-llama3-fast` (Ollama 8B) or Groq `llama-3.1-8b-instant`.
   - **Cost:** ~$0 (Local) or extremely low.
   - **Latency:** < 1s.

2. **Tier 2: Intermediate Reasoning (Lead Summarization, Standard RAG)**
   - **Target:** `local-llama3` (Ollama 70B if hardware permits) or Groq `llama-3.3-70b-versatile`.
   - **Cost:** Very low.
   - **Latency:** 1-2s.

3. **Tier 3: Complex Reasoning / Agent Orchestration (Writing highly personalized emails, complex extraction)**
   - **Target:** `gpt-4o` / `claude-3-5-sonnet`.
   - **Cost:** High.
   - **Strategy:** Only invoke these via premium features or strictly limited quotas per tenant.

## Action Plan
- Remove hardcoded fallbacks from premium to local models if the task strictly requires premium reasoning.
- Define a strict `enum` in the codebase for task complexities and map them to these tiers dynamically.