export class AnomalyDetector {
  static async detect(tenantId: string): Promise<string[]> {
    // Compares current metrics against a moving average + standard deviations
    const anomalies: string[] = [];
    
    // Mock anomaly detection logic
    const currentConversion = 0.02; // 2%
    const historicalAvg = 0.08; // 8%
    
    if (currentConversion < historicalAvg * 0.5) {
      anomalies.push('CRITICAL: Win Rate dropped below 50% of historical average.');
    }

    return anomalies;
  }
}
