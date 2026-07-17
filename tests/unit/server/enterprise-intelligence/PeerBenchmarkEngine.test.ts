import { describe, it, expect } from 'vitest';
import { PeerBenchmarkEngine } from '../../../../server/enterprise-intelligence/benchmarking/PeerBenchmarkEngine.js';

describe('PeerBenchmarkEngine', () => {
  it('computes the peer median and a 100th percentile for the top value', () => {
    const result = PeerBenchmarkEngine.compare('win_rate', 100, [10, 20, 30, 40, 100]);
    expect(result.peerMedian).toBe(30);
    expect(result.percentile).toBe(100);
  });

  it('defaults to the 50th percentile when there are no peers to compare against', () => {
    const result = PeerBenchmarkEngine.compare('win_rate', 50, []);
    expect(result.percentile).toBe(50);
  });
});
