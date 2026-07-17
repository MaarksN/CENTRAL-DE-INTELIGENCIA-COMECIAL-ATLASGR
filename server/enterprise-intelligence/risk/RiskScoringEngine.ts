export interface RiskFactors {
  contractConcentration: number;
  paymentDelinquency: number;
  supportEscalations: number;
}

export class RiskScoringEngine {
  static score(factors: RiskFactors): { score: number; level: 'low' | 'medium' | 'high' } {
    const raw = factors.contractConcentration * 0.4 + factors.paymentDelinquency * 0.4 + factors.supportEscalations * 0.2;
    const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    const level = score >= 66 ? 'high' : score >= 33 ? 'medium' : 'low';
    return { score, level };
  }
}
