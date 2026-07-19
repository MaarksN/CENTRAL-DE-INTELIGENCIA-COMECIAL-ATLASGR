import { prisma } from '../../lib/prisma';

export class IngestionService {
    async ingestText(text: string, title: string) {
        // Create document
        const document = await prisma.document.create({
            data: {
                title,
                content: text,
                metadata: {}
            }
        });

        // Basic chunking (e.g., split by newlines, rough length check)
        const chunks = text.split('\n\n').filter(chunk => chunk.trim().length > 0);

        // This is a basic simulation of embeddings array -> pgvector
        // In a real env, we'd use OpenAI Embeddings API or similar.
        for (const chunkContent of chunks) {
            await prisma.$executeRaw`
                INSERT INTO "DocumentChunk" ("id", "documentId", "content", "vector")
                VALUES (gen_random_uuid()::text, ${document.id}, ${chunkContent}, '[0,0,0]'::vector)
            `;
        }

        return document;
    }
}
