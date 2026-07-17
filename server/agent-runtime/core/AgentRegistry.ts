import { AgentManifest } from './AgentManifest.js';

export class AgentRegistry {
  private static agents: Map<string, AgentManifest> = new Map();

  static register(manifest: AgentManifest): void {
    if (this.agents.has(manifest.id)) {
      throw new Error(`Agent ${manifest.id} is already registered.`);
    }
    this.agents.set(manifest.id, manifest);
    console.log(`[AgentRegistry] Registered Agent: ${manifest.name} (${manifest.id})`);
  }

  static get(id: string): AgentManifest | undefined {
    return this.agents.get(id);
  }

  static getAll(): AgentManifest[] {
    return Array.from(this.agents.values());
  }
}
