import { prisma } from '../../../src/lib/prisma.js';

export interface IVectorStore {
  save(documentId: string, chunks: string[], embeddings: number[][]): Promise<void>;
  search(queryEmbedding: number[], limit: number): Promise<any[]>;
}

export class PgVectorStore implements IVectorStore {
  async save(documentId: string, chunks: string[], embeddings: number[][]): Promise<void> {
    for (let i = 0; i < chunks.length; i++) {
      // Direct raw query to insert pgvector
      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "createdAt")
        VALUES (gen_random_uuid()::text, ${documentId}, ${chunks[i]}, ${embeddings[i]}::vector, NOW())
      `;
    }
  }

  async search(queryEmbedding: number[], limit: number = 5): Promise<any[]> {
    // Search using pgvector cosine distance operator <=>
    const results = await prisma.$queryRaw<any[]>`
      SELECT id, "documentId", content, metadata, 1 - (embedding <=> ${queryEmbedding}::vector) as score
      FROM "DocumentChunk"
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT ${limit}
    `;
    return results;
  }
}
