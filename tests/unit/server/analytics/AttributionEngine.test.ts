import { describe, it, expect } from 'vitest';
import { AttributionEngine } from '../../../../server/analytics/attribution/AttributionEngine.js';

describe('AttributionEngine', () => {
  it('defaults to the linear attribution model', async () => {
    const result = await AttributionEngine.calculateAttribution('tenant-1');
    expect(result.model).toBe('linear');
  });

  it('echoes back the requested model and returns revenue sources', async () => {
    const result = await AttributionEngine.calculateAttribution('tenant-1', 'first-touch');
    expect(result.model).toBe('first-touch');
    expect(Array.isArray(result.sources)).toBe(true);
    expect(result.sources.length).toBeGreaterThan(0);
  });
});
