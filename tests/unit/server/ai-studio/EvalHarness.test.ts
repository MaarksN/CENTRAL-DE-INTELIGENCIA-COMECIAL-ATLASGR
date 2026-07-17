import { describe, it, expect } from 'vitest';
import { EvalHarness } from '../../../../server/ai-studio/evaluation/EvalHarness.js';

describe('EvalHarness', () => {
  it('counts passed and failed cases correctly', async () => {
    const result = await EvalHarness.run(
      [
        { input: 'a', expectedContains: ['A'] },
        { input: 'b', expectedContains: ['Z'] },
      ],
      async (input) => input.toUpperCase(),
    );

    expect(result).toEqual({ passed: 1, failed: 1, total: 2 });
  });

  it('returns a zeroed result for an empty case list', async () => {
    const result = await EvalHarness.run([], async () => '');
    expect(result).toEqual({ passed: 0, failed: 0, total: 0 });
  });
});
