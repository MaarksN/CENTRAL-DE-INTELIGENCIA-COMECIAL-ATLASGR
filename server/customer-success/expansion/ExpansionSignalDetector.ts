export interface ExpansionSignal {
  accountId: string;
  reason: 'usage_near_limit' | 'new_department_activity' | 'high_health_score';
  confidence: number;
}

export class ExpansionSignalDetector {
  static detect(accountId: string, usagePercent: number, healthScore: number): ExpansionSignal[] {
    const signals: ExpansionSignal[] = [];

    if (usagePercent >= 0.8) {
      signals.push({ accountId, reason: 'usage_near_limit', confidence: usagePercent });
    }
    if (healthScore >= 85) {
      signals.push({ accountId, reason: 'high_health_score', confidence: healthScore / 100 });
    }

    return signals;
  }
}
