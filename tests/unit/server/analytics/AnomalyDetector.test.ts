import { describe, it, expect } from 'vitest';
import { AnomalyDetector } from '../../../../server/analytics/anomaly/AnomalyDetector.js';

describe('AnomalyDetector', () => {
  it('flags a critical win-rate anomaly given the current mock data', async () => {
    const anomalies = await AnomalyDetector.detect('tenant-1');
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]).toMatch(/CRITICAL/);
  });
});
