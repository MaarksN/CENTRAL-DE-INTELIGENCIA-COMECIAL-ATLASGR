import { describe, it, expect } from 'vitest';
import { DynamicPricingEngine } from '../../../../server/revenue-system/pricing/DynamicPricingEngine.js';

describe('DynamicPricingEngine', () => {
  it('keeps price unchanged at neutral demand (0.5)', async () => {
    const price = await DynamicPricingEngine.recommendPrice(100, 0.5);
    expect(price).toBe(100);
  });

  it('never discounts more than 10% below list price', async () => {
    const price = await DynamicPricingEngine.recommendPrice(100, 0);
    expect(price).toBeGreaterThanOrEqual(90);
  });

  it('never surcharges more than 15% above list price', async () => {
    const price = await DynamicPricingEngine.recommendPrice(100, 1);
    expect(price).toBeLessThanOrEqual(115);
  });
});
