import { describe, it, expect } from 'vitest';
import { HealthScoreEngine } from '../../../../server/customer-success/health/HealthScoreEngine.js';

describe('HealthScoreEngine', () => {
  it('scores a fully healthy account near 100', () => {
    const score = HealthScoreEngine.score({ usageTrend: 1, supportTicketVelocity: 0, npsScore: 10, engagementFrequency: 1 });
    expect(score).toBe(100);
  });

  it('scores a fully unhealthy account at 0', () => {
    const score = HealthScoreEngine.score({ usageTrend: 0, supportTicketVelocity: 1, npsScore: 0, engagementFrequency: 0 });
    expect(score).toBe(0);
  });

  it('band() classifies scores into healthy/at_risk/critical', () => {
    expect(HealthScoreEngine.band(80)).toBe('healthy');
    expect(HealthScoreEngine.band(50)).toBe('at_risk');
    expect(HealthScoreEngine.band(10)).toBe('critical');
  });
});
