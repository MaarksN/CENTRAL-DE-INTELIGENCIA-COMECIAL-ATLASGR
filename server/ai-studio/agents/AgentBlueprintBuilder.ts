import { AgentRegistry } from '../../agent-runtime/core/AgentRegistry.js';
import { AgentManifest } from '../../agent-runtime/core/AgentManifest.js';

export class AgentBlueprintBuilder {
  static async publish(manifest: AgentManifest): Promise<void> {
    AgentRegistry.register(manifest);
  }

  static draft(name: string, description: string): AgentManifest {
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      version: '0.1.0',
      supportedTools: [],
      memoryType: 'session',
      permissions: [],
      listensTo: [],
      publishesTo: [],
    };
  }
}
