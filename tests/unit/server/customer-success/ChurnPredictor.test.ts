import { describe, it, expect } from 'vitest';
import { ChurnPredictor } from '../../../../server/customer-success/churn/ChurnPredictor.js';

describe('ChurnPredictor', () => {
  it('flags low usage and declining health as top signals when both apply', () => {
    const prediction = ChurnPredictor.predict('acc-1', 30, 25);
    expect(prediction.topSignals).toEqual(['Low product usage', 'Declining health score']);
  });

  it('produces a higher churn probability for inactive, unhealthy accounts', () => {
    const risky = ChurnPredictor.predict('acc-1', 20, 30);
    const healthy = ChurnPredictor.predict('acc-2', 90, 1);
    expect(risky.probability).toBeGreaterThan(healthy.probability);
  });
});
