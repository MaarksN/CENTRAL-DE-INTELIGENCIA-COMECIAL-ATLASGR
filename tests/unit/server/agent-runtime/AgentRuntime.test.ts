import { describe, it, expect } from 'vitest';
import { AgentRuntime } from '../../../../server/agent-runtime/core/AgentRuntime.js';
import { AgentRegistry } from '../../../../server/agent-runtime/core/AgentRegistry.js';
import { AgentContext } from '../../../../server/agent-runtime/context/AgentContext.js';

describe('AgentRuntime', () => {
  it('reports not_found for an execution id that was never started', () => {
    expect(AgentRuntime.getStatus('unknown-execution-id')).toBe('not_found');
  });

  it('throws when starting an agent that is not registered', async () => {
    await expect(AgentRuntime.startAgent('unregistered-agent', new AgentContext())).rejects.toThrow(/not found in registry/);
  });

  it('runs a registered agent end-to-end and marks it completed', async () => {
    AgentRegistry.register({
      id: 'runtime-test-agent',
      name: 'Runtime Test Agent',
      description: 'test',
      version: '0.1.0',
      supportedTools: [],
      memoryType: 'session',
      permissions: [],
      listensTo: [],
      publishesTo: [],
    });

    const executionId = await AgentRuntime.startAgent('runtime-test-agent', new AgentContext({ tenantId: 't1' }));
    expect(AgentRuntime.getStatus(executionId)).toBe('completed');
  });

  it('stopAgent marks a running execution as stopped', async () => {
    AgentRegistry.register({
      id: 'runtime-test-agent-2',
      name: 'Runtime Test Agent 2',
      description: 'test',
      version: '0.1.0',
      supportedTools: [],
      memoryType: 'session',
      permissions: [],
      listensTo: [],
      publishesTo: [],
    });
    const executionId = await AgentRuntime.startAgent('runtime-test-agent-2', new AgentContext());
    AgentRuntime.stopAgent(executionId);
    expect(AgentRuntime.getStatus(executionId)).toBe('stopped');
  });
});
