import { describe, it, expect } from 'vitest';
import { ForecastEngine } from '../../../../server/analytics/forecasting/ForecastEngine.js';

describe('ForecastEngine', () => {
  it('produces exactly the number of forecast points requested', async () => {
    const forecasts = await ForecastEngine.forecastRevenue('tenant-1', 3);
    expect(forecasts).toHaveLength(3);
  });

  it('applies compounding 5% growth month over month', async () => {
    const forecasts = await ForecastEngine.forecastRevenue('tenant-1', 2);
    expect(forecasts[0]).toBe(Math.round(150000 * 1.05));
    expect(forecasts[1]).toBe(Math.round(150000 * 1.05 * 1.05));
  });

  it('returns an empty array when zero months are requested', async () => {
    expect(await ForecastEngine.forecastRevenue('tenant-1', 0)).toEqual([]);
  });
});
