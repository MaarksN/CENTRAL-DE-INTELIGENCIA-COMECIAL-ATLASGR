import { AgentRuntime } from '../../agent-runtime/core/AgentRuntime.js';
import { AgentContext } from '../../agent-runtime/context/AgentContext.js';

export class RenewalAutomation {
  static async scheduleRenewalAgent(tenantId: string, accountId: string): Promise<string> {
    const context = new AgentContext({ tenantId, accountId });
    return AgentRuntime.startAgent('renewal-agent', context);
  }
}
