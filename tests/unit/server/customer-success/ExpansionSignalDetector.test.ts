import { describe, it, expect } from 'vitest';
import { ExpansionSignalDetector } from '../../../../server/customer-success/expansion/ExpansionSignalDetector.js';

describe('ExpansionSignalDetector', () => {
  it('detects a usage-near-limit signal above the 80% threshold', () => {
    const signals = ExpansionSignalDetector.detect('acc-1', 0.85, 50);
    expect(signals.some((s) => s.reason === 'usage_near_limit')).toBe(true);
  });

  it('detects a high-health-score signal above 85', () => {
    const signals = ExpansionSignalDetector.detect('acc-1', 0.1, 90);
    expect(signals.some((s) => s.reason === 'high_health_score')).toBe(true);
  });

  it('returns no signals for a low-usage, mid-health account', () => {
    expect(ExpansionSignalDetector.detect('acc-1', 0.2, 60)).toEqual([]);
  });
});
