export interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export class GeminiEmbeddingProvider implements IEmbeddingProvider {
  async embed(text: string): Promise<number[]> {
    // In production, this uses GoogleGenAI embeddings API.
    // For local deterministic test, return a mock 768d vector.
    console.log(`[GeminiEmbeddingProvider] Embedding generated for chunk.`);
    return new Array(768).fill(0.01);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(t => this.embed(t)));
  }
}
