# RAG Architecture Audit - Onda 3

## Overview
The platform utilizes pgvector directly integrated via Prisma and local embeddings (Xenova Transformers).

## Findings
- **Storage:** `KnowledgeChunk` and `DocumentChunk` models exist in Prisma, storing the vectors alongside textual content and metadata.
- **Tenant Isolation:** Mandatory tenant filtering (`organizationId`) must be strictly applied on the vector search SQL layer to prevent data leakage between tenants during RAG retrievals.

## Optimizations Recommended
1. **Hybrid Search (Meilisearch + pgvector):** While pgvector is excellent for semantic search, keyword search often underperforms in pure vector DBs for exact matches (like names, IDs, or specific acronyms). Integrating Meilisearch (already present in the stack) for keyword retrieval and merging results via Reciprocal Rank Fusion (RRF) will drastically improve RAG context accuracy.
2. **Chunking Strategy:** Audit the chunk overlap strategy. Ensure chunks do not split mid-sentence or mid-code block.