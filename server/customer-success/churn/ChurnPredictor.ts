export interface ChurnPrediction {
  accountId: string;
  probability: number;
  topSignals: string[];
}

export class ChurnPredictor {
  static predict(accountId: string, healthScore: number, daysSinceLastLogin: number): ChurnPrediction {
    const loginFactor = Math.min(1, daysSinceLastLogin / 30);
    const probability = Math.round((loginFactor * 0.6 + (1 - healthScore / 100) * 0.4) * 100) / 100;

    const topSignals: string[] = [];
    if (daysSinceLastLogin > 14) topSignals.push('Low product usage');
    if (healthScore < 50) topSignals.push('Declining health score');

    return { accountId, probability, topSignals };
  }
}
