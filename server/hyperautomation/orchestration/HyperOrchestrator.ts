import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';
import { AgentRuntime } from '../../agent-runtime/core/AgentRuntime.js';
import { AgentContext } from '../../agent-runtime/context/AgentContext.js';

export class HyperOrchestrator {
  static async runEndToEndProcess(processId: string, tenantId: string): Promise<string> {
    await eventBus.publish({
      eventType: 'hyperautomation.process.started',
      source: 'HyperOrchestrator',
      payload: { processId, tenantId },
    });

    const context = new AgentContext({ processId, tenantId });
    return AgentRuntime.startAgent('process-execution-agent', context);
  }
}
