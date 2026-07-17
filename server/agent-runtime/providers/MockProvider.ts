import { AIProvider, GenerateParams } from './AIProvider.js';

export class MockProvider implements AIProvider {
  name = 'MockProvider';

  async generate(params: GenerateParams): Promise<string> {
    console.log(`[MockProvider] Generating response for: ${params.prompt.substring(0, 50)}...`);
    return JSON.stringify({
      status: 'success',
      mocked_reasoning: 'This is a deterministic mock response representing an AI agent action.',
      suggested_tools: params.tools?.map(t => t.name) || []
    });
  }

  async *stream(params: GenerateParams): AsyncIterable<string> {
    yield 'This ';
    yield 'is ';
    yield 'a ';
    yield 'mock ';
    yield 'stream.';
  }
}
