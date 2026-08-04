# LLM Benchmark & Cost Analysis - Onda 3

## Synthetic Benchmark Expectations (CRM Workloads)

| Provider / Model | Latency (Avg) | Output Token Speed | Cost per 1M Tokens (In/Out) | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Ollama (llama-3-8b)** | 800ms - 2s | 40-60 T/s | $0.00 / $0.00 (Compute only) | Basic extraction, internal RAG routing. |
| **Groq (llama-3-8b)** | < 300ms | > 800 T/s | ~$0.05 / ~$0.08 | Real-time chat, rapid categorization. |
| **Groq (llama-3-70b)** | 500ms - 1s | 300 T/s | ~$0.59 / ~$0.79 | Deep RAG analysis, Agent reasoning. |
| **OpenAI (gpt-4o)** | 1.5s - 3s | 60-100 T/s | $5.00 / $15.00 | Complex structural generation. |

## AI Cost Control Directives
1. **Never use GPT-4o for pure categorization or simple data extraction.** Enforce `Groq (llama-3)` via the AI Gateway.
2. Embeddings are currently local (`Xenova`), costing $0 in API fees but consuming RAM/CPU.
3. Track and aggregate token usage via LiteLLM's `usage` payload and sync to the `AILog` Prisma table to bill tenants accurately based on their consumption tier.