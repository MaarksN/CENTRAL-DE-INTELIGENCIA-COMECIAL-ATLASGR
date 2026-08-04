# AI Cost Analysis - Onda 3

## Return on Investment (ROI) vs API Cost
Currently, relying on local instances (Ollama) or extremely fast/cheap inference engines (Groq) ensures that AI operations (like lead enrichment) cost fractions of a cent per lead.

## Cost Per Action (Estimated)
- **Data Enrichment (Lead):** $0.0001 (Groq Llama 3 8B)
- **Email Generation:** $0.0005 (Groq Llama 3 70B)
- **Roleplay Session (10 min):** $0.02 (Groq Llama 3 70B)

The architecture is highly optimized for cost. The main risk is compute exhaustion on the local server if local models are overutilized simultaneously.