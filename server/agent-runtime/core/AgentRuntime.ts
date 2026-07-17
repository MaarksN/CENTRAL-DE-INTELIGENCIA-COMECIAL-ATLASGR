import { AgentRegistry } from './AgentRegistry.js';
import { AgentContext } from '../context/AgentContext.js';
import { Planner } from '../planner/Planner.js';
import { AIProvider } from '../providers/AIProvider.js';
import { MockProvider } from '../providers/MockProvider.js';

export class AgentRuntime {
  private static activeAgents: Map<string, any> = new Map();
  public static provider: AIProvider = new MockProvider();

  static async startAgent(agentId: string, context: AgentContext): Promise<string> {
    const manifest = AgentRegistry.get(agentId);
    if (!manifest) {
      throw new Error(`Agent ${agentId} not found in registry.`);
    }

    const executionId = crypto.randomUUID();
    console.log(`[AgentRuntime] Starting Agent ${manifest.name} (Execution ID: ${executionId})`);
    
    // In a real scenario, this would spin up a process or worker.
    // For this runtime infrastructure, we just execute via Planner.
    this.activeAgents.set(executionId, { agentId, status: 'running', context });

    try {
      const plan = await Planner.createPlan(manifest, context, this.provider);
      await Planner.executePlan(plan, context, this.provider);
      
      this.activeAgents.get(executionId).status = 'completed';
    } catch (err) {
      console.error(`[AgentRuntime] Agent execution failed:`, err);
      this.activeAgents.get(executionId).status = 'failed';
    }

    return executionId;
  }

  static getStatus(executionId: string): string {
    const instance = this.activeAgents.get(executionId);
    return instance ? instance.status : 'not_found';
  }

  static stopAgent(executionId: string): void {
    const instance = this.activeAgents.get(executionId);
    if (instance) {
      instance.status = 'stopped';
      console.log(`[AgentRuntime] Stopped Agent Execution ${executionId}`);
    }
  }
}
