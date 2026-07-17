import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';
import { HealthScoreEngine } from '../health/HealthScoreEngine.js';

export class CSPlaybookEngine {
  static async evaluateAccount(accountId: string, score: number): Promise<void> {
    const band = HealthScoreEngine.band(score);

    if (band !== 'healthy') {
      await eventBus.publish({
        eventType: 'customer_success.playbook.triggered',
        source: 'CSPlaybookEngine',
        payload: { accountId, band, score },
      });
    }
  }
}
