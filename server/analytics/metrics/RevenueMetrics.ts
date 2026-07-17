import { DataWarehouseSim } from '../warehouse/DataWarehouseSim.js';

export class RevenueMetrics {
  static async calculateMRR(tenantId: string): Promise<number> {
    // Fetches from warehouse and calculates
    const facts = await DataWarehouseSim.queryFactSales(tenantId, new Date(), new Date());
    return facts.reduce((acc, curr) => acc + curr.revenue, 0);
  }

  static async calculateLTV(tenantId: string): Promise<number> {
    return 12000; // Mock calculation
  }

  static async calculateCAC(tenantId: string): Promise<number> {
    return 1500; // Mock calculation
  }
}
