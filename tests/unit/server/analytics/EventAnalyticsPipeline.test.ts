import { describe, it, expect } from 'vitest';
import { EventAnalyticsPipeline } from '../../../../server/analytics/event-pipeline/EventAnalyticsPipeline.js';

describe('EventAnalyticsPipeline', () => {
  it('ingest resolves without throwing for a well-formed event', async () => {
    await expect(
      EventAnalyticsPipeline.ingest({
        type: 'deal.won',
        source: 'crm',
        tenantId: 'tenant-1',
        payload: { dealId: 'd1' },
        timestamp: new Date().toISOString(),
      }),
    ).resolves.toBeUndefined();
  });
});
