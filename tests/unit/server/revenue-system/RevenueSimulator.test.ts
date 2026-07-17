import { describe, it, expect } from 'vitest';
import { RevenueSimulator } from '../../../../server/revenue-system/forecasting/RevenueSimulator.js';

describe('RevenueSimulator', () => {
  it('returns three named scenarios ordered from conservative to aggressive', async () => {
    const scenarios = await RevenueSimulator.simulate(100000);
    expect(scenarios.map((s) => s.name)).toEqual(['Conservative', 'Base', 'Aggressive']);
  });

  it('projects increasing ARR and decreasing confidence across scenarios', async () => {
    const scenarios = await RevenueSimulator.simulate(100000);
    expect(scenarios[0].projectedArr).toBeLessThan(scenarios[2].projectedArr);
    expect(scenarios[0].confidence).toBeGreaterThan(scenarios[2].confidence);
  });
});
