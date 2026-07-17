import { describe, it, expect } from 'vitest';
import { RiskScoringEngine } from '../../../../server/enterprise-intelligence/risk/RiskScoringEngine.js';

describe('RiskScoringEngine', () => {
  it('classifies a fully clean account as low risk', () => {
    const result = RiskScoringEngine.score({ contractConcentration: 0, paymentDelinquency: 0, supportEscalations: 0 });
    expect(result.level).toBe('low');
    expect(result.score).toBe(0);
  });

  it('classifies a maxed-out risk profile as high', () => {
    const result = RiskScoringEngine.score({ contractConcentration: 1, paymentDelinquency: 1, supportEscalations: 1 });
    expect(result.level).toBe('high');
    expect(result.score).toBe(100);
  });
});
