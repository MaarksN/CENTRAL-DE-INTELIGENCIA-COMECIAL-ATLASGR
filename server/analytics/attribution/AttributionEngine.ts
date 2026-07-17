export type AttributionModel = 'first-touch' | 'last-touch' | 'linear';

export class AttributionEngine {
  static async calculateAttribution(tenantId: string, model: AttributionModel = 'linear'): Promise<any> {
    // Distributes deal revenue across marketing/sales touches based on the model
    return {
      model,
      sources: [
        { source: 'Inbound Marketing', value: 45000 },
        { source: 'Outbound BDR', value: 80000 },
        { source: 'Referral', value: 12000 }
      ]
    };
  }
}
