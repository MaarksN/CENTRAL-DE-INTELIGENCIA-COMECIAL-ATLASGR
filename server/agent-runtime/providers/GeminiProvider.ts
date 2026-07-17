import { AIProvider, GenerateParams } from './AIProvider.js';
import { GoogleGenAI } from '@google/genai';

export class GeminiProvider implements AIProvider {
  name = 'GeminiProvider';
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generate(params: GenerateParams): Promise<string> {
    console.log(`[GeminiProvider] Generating response for prompt...`);
    
    let fullPrompt = params.prompt;
    if (params.systemPrompt) {
      fullPrompt = `SYSTEM INSTRUCTION:\n${params.systemPrompt}\n\nUSER PROMPT:\n${params.prompt}`;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.2, // low temp for agentic determinism
        }
      });
      return response.text || '';
    } catch (err) {
      console.error(`[GeminiProvider] Error:`, err);
      throw err;
    }
  }

  async *stream(params: GenerateParams): AsyncIterable<string> {
    yield* ['Streaming ', 'not ', 'fully ', 'implemented ', 'yet.'];
  }
}
