import { describe, it, expect } from 'vitest';
import { NaturalLanguageQueryEngine } from '../../../../server/enterprise-intelligence/nlq/NaturalLanguageQueryEngine.js';

describe('NaturalLanguageQueryEngine', () => {
  it('interprets a churn-related question', async () => {
    const result = await NaturalLanguageQueryEngine.ask('What is our churn this quarter?');
    expect(result.interpretedMetric).toBe('Churn Rate');
  });

  it('falls back to a general overview for unrecognized questions', async () => {
    const result = await NaturalLanguageQueryEngine.ask('How is the weather?');
    expect(result.interpretedMetric).toBe('General Overview');
  });
});
