export interface GenerateParams {
  systemPrompt?: string;
  prompt: string;
  tools?: any[]; // Simplified for now
}

export interface AIProvider {
  name: string;
  generate(params: GenerateParams): Promise<string>;
  stream(params: GenerateParams): AsyncIterable<string>;
  embeddings?(text: string): Promise<number[]>;
}
