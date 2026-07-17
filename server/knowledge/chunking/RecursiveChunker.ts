export interface IChunker {
  chunk(text: string): string[];
}

export class RecursiveChunker implements IChunker {
  constructor(private maxChunkSize: number = 1000, private overlap: number = 200) {}

  chunk(text: string): string[] {
    // Simple placeholder for recursive chunking
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + this.maxChunkSize));
      i += (this.maxChunkSize - this.overlap);
    }
    return chunks;
  }
}
