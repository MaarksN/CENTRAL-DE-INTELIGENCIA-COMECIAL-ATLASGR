export interface RevenueScenario {
  name: string;
  projectedArr: number;
  confidence: number;
}

export class RevenueSimulator {
  static async simulate(currentArr: number): Promise<RevenueScenario[]> {
    return [
      { name: 'Conservative', projectedArr: currentArr * 1.05, confidence: 0.85 },
      { name: 'Base', projectedArr: currentArr * 1.15, confidence: 0.65 },
      { name: 'Aggressive', projectedArr: currentArr * 1.30, confidence: 0.35 },
    ];
  }
}
