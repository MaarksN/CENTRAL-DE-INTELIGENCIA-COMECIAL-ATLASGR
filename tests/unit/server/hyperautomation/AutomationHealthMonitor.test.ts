import { describe, it, expect } from 'vitest';
import { AutomationHealthMonitor } from '../../../../server/hyperautomation/monitoring/AutomationHealthMonitor.js';

describe('AutomationHealthMonitor', () => {
  it('computes a success rate from total and failed processes', () => {
    expect(AutomationHealthMonitor.snapshot(100, 4).successRate).toBe(0.96);
  });

  it('reports a perfect success rate when there are no processes', () => {
    expect(AutomationHealthMonitor.snapshot(0, 0).successRate).toBe(1);
  });
});
