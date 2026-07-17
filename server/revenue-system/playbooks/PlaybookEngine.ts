export interface RevenuePlaybook {
  id: string;
  name: string;
  trigger: 'stalled_deal' | 'renewal_due' | 'usage_spike' | 'price_drift';
}

export class PlaybookEngine {
  static async getEligiblePlaybooks(_tenantId: string): Promise<RevenuePlaybook[]> {
    // Mock: in production this would query playbook rules against live pipeline state
    return [
      { id: 'pb-stalled-deal', name: 'Re-engage Stalled Deal', trigger: 'stalled_deal' },
      { id: 'pb-renewal', name: 'Renewal Acceleration', trigger: 'renewal_due' },
    ];
  }
}
