export interface AutomationHealthSnapshot {
  totalProcesses: number;
  failedLast24h: number;
  successRate: number;
}

export class AutomationHealthMonitor {
  static snapshot(totalProcesses: number, failedLast24h: number): AutomationHealthSnapshot {
    const successRate = totalProcesses === 0 ? 1 : Math.round(((totalProcesses - failedLast24h) / totalProcesses) * 100) / 100;
    return { totalProcesses, failedLast24h, successRate };
  }
}
