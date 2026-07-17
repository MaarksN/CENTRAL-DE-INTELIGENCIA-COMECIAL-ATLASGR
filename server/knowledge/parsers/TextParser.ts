export interface ParserResult {
  text: string;
  metadata: Record<string, any>;
}

export interface IParser {
  parse(rawContent: Buffer | string): Promise<ParserResult>;
}

export class TextParser implements IParser {
  async parse(rawContent: Buffer | string): Promise<ParserResult> {
    const text = typeof rawContent === 'string' ? rawContent : rawContent.toString('utf-8');
    return {
      text,
      metadata: { type: 'text/plain', length: text.length }
    };
  }
}
