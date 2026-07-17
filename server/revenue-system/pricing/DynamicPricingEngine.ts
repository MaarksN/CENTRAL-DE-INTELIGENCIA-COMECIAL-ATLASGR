export class DynamicPricingEngine {
  static async recommendPrice(baseListPrice: number, demandScore: number): Promise<number> {
    // Mock elasticity model: bounded adjustment between -10% and +15%
    const adjustment = Math.max(-0.1, Math.min(0.15, (demandScore - 0.5) * 0.3));
    return Math.round(baseListPrice * (1 + adjustment) * 100) / 100;
  }
}
