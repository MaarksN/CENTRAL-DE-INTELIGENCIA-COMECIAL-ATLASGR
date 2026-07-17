import { describe, it, expect, vi, afterEach } from 'vitest';
import { HyperOrchestrator } from '../../../../server/hyperautomation/orchestration/HyperOrchestrator.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';
import { AgentRegistry } from '../../../../server/agent-runtime/core/AgentRegistry.js';
import { AgentRuntime } from '../../../../server/agent-runtime/core/AgentRuntime.js';

describe('HyperOrchestrator', () => {
  afterEach(() => vi.restoreAllMocks());

  it('publishes a process-started event and completes the execution agent', async () => {
    vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');
    if (!AgentRegistry.get('process-execution-agent')) {
      AgentRegistry.register({
        id: 'process-execution-agent',
        name: 'Process Execution Agent',
        description: 'test',
        version: '0.1.0',
        supportedTools: [],
        memoryType: 'session',
        permissions: [],
        listensTo: [],
        publishesTo: [],
      });
    }

    const executionId = await HyperOrchestrator.runEndToEndProcess('proc-1', 'tenant-1');

    expect(AgentRuntime.getStatus(executionId)).toBe('completed');
  });
});
