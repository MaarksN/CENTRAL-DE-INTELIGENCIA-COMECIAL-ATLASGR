import { describe, it, expect } from 'vitest';
import { MockProvider } from '../../../../server/agent-runtime/providers/MockProvider.js';

describe('MockProvider', () => {
  it('generate() returns deterministic JSON with a success status', async () => {
    const provider = new MockProvider();
    const raw = await provider.generate({ prompt: 'do the thing' });
    const parsed = JSON.parse(raw);
    expect(parsed.status).toBe('success');
  });

  it('generate() echoes tool names into suggested_tools', async () => {
    const provider = new MockProvider();
    const raw = await provider.generate({ prompt: 'p', tools: [{ name: 'send_email' }] });
    const parsed = JSON.parse(raw);
    expect(parsed.suggested_tools).toEqual(['send_email']);
  });

  it('stream() yields the expected token sequence', async () => {
    const provider = new MockProvider();
    const tokens: string[] = [];
    for await (const token of provider.stream({ prompt: 'p' })) {
      tokens.push(token);
    }
    expect(tokens.join('')).toBe('This is a mock stream.');
  });
});
