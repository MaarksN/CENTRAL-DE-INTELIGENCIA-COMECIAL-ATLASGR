import { describe, it, expect } from 'vitest';
import { AgentBlueprintBuilder } from '../../../../server/ai-studio/agents/AgentBlueprintBuilder.js';
import { AgentRegistry } from '../../../../server/agent-runtime/core/AgentRegistry.js';

describe('AgentBlueprintBuilder', () => {
  it('draft() slugifies the agent name into a stable id', () => {
    const manifest = AgentBlueprintBuilder.draft('My Cool Agent', 'does cool things');
    expect(manifest.id).toBe('my-cool-agent');
    expect(manifest.description).toBe('does cool things');
  });

  it('publish() registers the drafted manifest in the Agent Runtime registry', async () => {
    const manifest = AgentBlueprintBuilder.draft('Blueprint Publish Test', 'test');
    await AgentBlueprintBuilder.publish(manifest);
    expect(AgentRegistry.get('blueprint-publish-test')).toBeDefined();
  });
});
