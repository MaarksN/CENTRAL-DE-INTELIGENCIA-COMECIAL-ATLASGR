import { PgVectorStore } from '../vector-store/PgVectorStore.js';
import { GeminiEmbeddingProvider } from '../embeddings/GeminiEmbeddingProvider.js';

export interface SearchResult {
  documentId: string;
  content: string;
  score: number;
}

export class RetrievalEngine {
  private store = new PgVectorStore();
  private embeddings = new GeminiEmbeddingProvider();

  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    // 1. Convert text to vector
    const queryVector = await this.embeddings.embed(query);
    
    // 2. Vector Search
    const results = await this.store.search(queryVector, limit);
    
    // 3. Reranking (TF-IDF pseudo-mock for Phase 6)
    // Here we just map the pure pgvector results to our interface.
    return results.map(r => ({
      documentId: r.documentId,
      content: r.content,
      score: r.score
    }));
  }
}
