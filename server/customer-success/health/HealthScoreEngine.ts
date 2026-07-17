export interface HealthFactors {
  usageTrend: number;
  supportTicketVelocity: number;
  npsScore: number;
  engagementFrequency: number;
}

export class HealthScoreEngine {
  static score(factors: HealthFactors): number {
    const weighted =
      factors.usageTrend * 0.35 +
      (1 - factors.supportTicketVelocity) * 0.2 +
      (factors.npsScore / 10) * 0.25 +
      factors.engagementFrequency * 0.2;

    return Math.round(Math.max(0, Math.min(1, weighted)) * 100);
  }

  static band(score: number): 'healthy' | 'at_risk' | 'critical' {
    if (score >= 70) return 'healthy';
    if (score >= 40) return 'at_risk';
    return 'critical';
  }
}
