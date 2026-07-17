import { describe, it, expect } from 'vitest';
import { DataWarehouseSim } from '../../../../server/analytics/warehouse/DataWarehouseSim.js';

describe('DataWarehouseSim', () => {
  it('queryFactSales returns rows with date and revenue fields', async () => {
    const rows = await DataWarehouseSim.queryFactSales('tenant-1', new Date(), new Date());
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('revenue');
  });

  it('queryDimLeadActivity returns status/count breakdown rows', async () => {
    const rows = await DataWarehouseSim.queryDimLeadActivity('tenant-1');
    expect(rows.every((r) => 'status' in r && 'count' in r)).toBe(true);
  });
});
