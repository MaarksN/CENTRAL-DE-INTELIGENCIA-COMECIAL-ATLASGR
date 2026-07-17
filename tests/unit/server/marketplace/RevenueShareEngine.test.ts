import { describe, it, expect } from 'vitest';
import { RevenueShareEngine } from '../../../../server/marketplace/billing/RevenueShareEngine.js';

describe('RevenueShareEngine', () => {
  it('takes a 20% platform fee and pays the remainder to the partner', () => {
    const result = RevenueShareEngine.calculate(1000);
    expect(result.platformFee).toBe(200);
    expect(result.partnerPayout).toBe(800);
  });
});
