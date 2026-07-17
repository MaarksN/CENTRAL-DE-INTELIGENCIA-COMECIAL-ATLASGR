import { describe, it, expect } from 'vitest';
import { AgentRegistry } from '../../../../server/agent-runtime/core/AgentRegistry.js';
import { AgentManifest } from '../../../../server/agent-runtime/core/AgentManifest.js';

function manifest(id: string): AgentManifest {
  return {
    id,
    name: id,
    description: 'test agent',
    version: '0.1.0',
    supportedTools: [],
    memoryType: 'session',
    permissions: [],
    listensTo: [],
    publishesTo: [],
  };
}

describe('AgentRegistry', () => {
  it('registers and retrieves an agent manifest by id', () => {
    AgentRegistry.register(manifest('registry-test-agent-1'));
    expect(AgentRegistry.get('registry-test-agent-1')?.name).toBe('registry-test-agent-1');
  });

  it('throws when the same agent id is registered twice', () => {
    AgentRegistry.register(manifest('registry-test-agent-2'));
    expect(() => AgentRegistry.register(manifest('registry-test-agent-2'))).toThrow(/already registered/);
  });

  it('returns undefined for an unregistered agent id', () => {
    expect(AgentRegistry.get('does-not-exist')).toBeUndefined();
  });

  it('getAll includes every registered agent', () => {
    AgentRegistry.register(manifest('registry-test-agent-3'));
    const all = AgentRegistry.getAll();
    expect(all.some((a) => a.id === 'registry-test-agent-3')).toBe(true);
  });
});
