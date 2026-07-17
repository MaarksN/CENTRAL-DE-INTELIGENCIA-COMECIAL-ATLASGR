import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';
import { PlaybookEngine } from '../playbooks/PlaybookEngine.js';

export class RevenueOrchestrator {
  static async runCycle(tenantId: string): Promise<{ actionsTriggered: number }> {
    const playbooks = await PlaybookEngine.getEligiblePlaybooks(tenantId);
    let actionsTriggered = 0;

    for (const playbook of playbooks) {
      await eventBus.publish({
        eventType: 'revenue.playbook.triggered',
        source: 'RevenueOrchestrator',
        payload: { tenantId, playbookId: playbook.id },
      });
      actionsTriggered += 1;
    }

    return { actionsTriggered };
  }
}
