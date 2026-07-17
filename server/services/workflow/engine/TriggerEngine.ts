import { eventBus } from '../bus/MemoryEventBus.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';
import { TriggerRegistry } from '../registry/TriggerRegistry.js';
import { WorkflowRunner } from '../execution/WorkflowRunner.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class TriggerEngine {
  static initialize() {
    eventBus.subscribe('*', async (event: IWorkflowEvent) => {
      try {
        const matchingTriggers = TriggerRegistry.matchEvent(event);
        if (matchingTriggers.length === 0) return;
        
        // In a real system, you'd cache active workflows
        for (const trigger of matchingTriggers) {
          const wfs = await prisma.workflow.findMany({
            where: { status: 'active', triggerType: trigger.type }
          });
          
          for (const wf of wfs) {
            await WorkflowRunner.start(wf.id, event);
          }
        }
      } catch (err) {
        console.error('[TriggerEngine] Failed to route event:', err);
      }
    });
    
    console.log('[TriggerEngine] Initialized and listening to EventBus.');
  }
}
