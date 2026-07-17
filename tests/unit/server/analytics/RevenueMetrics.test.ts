import { describe, it, expect } from 'vitest';
import { RevenueMetrics } from '../../../../server/analytics/metrics/RevenueMetrics.js';

describe('RevenueMetrics', () => {
  it('calculateMRR sums revenue facts from the data warehouse', async () => {
    const mrr = await RevenueMetrics.calculateMRR('tenant-1');
    expect(mrr).toBe(37000);
  });

  it('calculateLTV returns the expected mock value', async () => {
    expect(await RevenueMetrics.calculateLTV('tenant-1')).toBe(12000);
  });

  it('calculateCAC returns the expected mock value', async () => {
    expect(await RevenueMetrics.calculateCAC('tenant-1')).toBe(1500);
  });
});
