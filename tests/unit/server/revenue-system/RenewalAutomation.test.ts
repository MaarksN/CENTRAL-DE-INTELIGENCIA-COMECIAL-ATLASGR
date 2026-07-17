import { describe, it, expect } from 'vitest';
import { RenewalAutomation } from '../../../../server/revenue-system/renewals/RenewalAutomation.js';
import { AgentRegistry } from '../../../../server/agent-runtime/core/AgentRegistry.js';
import { AgentRuntime } from '../../../../server/agent-runtime/core/AgentRuntime.js';

describe('RenewalAutomation', () => {
  it('starts a renewal-agent execution and completes it', async () => {
    if (!AgentRegistry.get('renewal-agent')) {
      AgentRegistry.register({
        id: 'renewal-agent',
        name: 'Renewal Agent',
        description: 'test',
        version: '0.1.0',
        supportedTools: [],
        memoryType: 'session',
        permissions: [],
        listensTo: [],
        publishesTo: [],
      });
    }

    const executionId = await RenewalAutomation.scheduleRenewalAgent('tenant-1', 'account-1');
    expect(AgentRuntime.getStatus(executionId)).toBe('completed');
  });
});
