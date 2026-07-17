import { describe, it, expect } from 'vitest';
import { GeminiEmbeddingProvider } from '../../../../server/knowledge/embeddings/GeminiEmbeddingProvider.js';

describe('GeminiEmbeddingProvider', () => {
  it('embed() returns a 768-dimension vector', async () => {
    const provider = new GeminiEmbeddingProvider();
    const vector = await provider.embed('some text');
    expect(vector).toHaveLength(768);
  });

  it('embedBatch() returns one vector per input text', async () => {
    const provider = new GeminiEmbeddingProvider();
    const vectors = await provider.embedBatch(['a', 'b', 'c']);
    expect(vectors).toHaveLength(3);
    expect(vectors[0]).toHaveLength(768);
  });
});
