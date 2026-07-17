import { describe, it, expect } from 'vitest';
import { DecisionEngine } from '../../../../server/hyperautomation/decisions/DecisionEngine.js';

describe('DecisionEngine', () => {
  it('returns the outcome of the first matching rule', () => {
    const outcome = DecisionEngine.evaluate({ amount: 5000 }, [
      { condition: (f) => f.amount > 10000, outcome: 'escalate' },
      { condition: (f) => f.amount > 1000, outcome: 'review' },
    ]);
    expect(outcome).toBe('review');
  });

  it('returns no_action when no rule matches', () => {
    expect(DecisionEngine.evaluate({ amount: 10 }, [{ condition: (f) => f.amount > 1000, outcome: 'review' }])).toBe('no_action');
  });
});
