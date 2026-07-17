import { describe, it, expect } from 'vitest';
import { PromptRegistry } from '../../../../server/ai-studio/prompts/PromptRegistry.js';

describe('PromptRegistry', () => {
  it('ships with the built-in sdr-outreach template', () => {
    expect(PromptRegistry.get('sdr-outreach')?.name).toBe('SDR Outreach');
  });

  it('returns undefined for an unknown template id', () => {
    expect(PromptRegistry.get('does-not-exist')).toBeUndefined();
  });

  it('register() adds a new template that list() then includes', () => {
    PromptRegistry.register({ id: 'test-template', name: 'Test Template', version: 1, template: 'hi {{name}}' });
    expect(PromptRegistry.list().some((t) => t.id === 'test-template')).toBe(true);
  });
});
