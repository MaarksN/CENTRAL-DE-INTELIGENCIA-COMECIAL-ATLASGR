import { AgentManifest } from '../core/AgentManifest.js';
import { AgentRegistry } from '../core/AgentRegistry.js';
import { ToolRegistry } from '../tools/ToolRegistry.js';
import { ITool } from '../tools/Tool.js';
import { AgentRuntime } from '../core/AgentRuntime.js';
import { AgentContext } from '../context/AgentContext.js';

export const AgentSDK = {
  createAgent(manifest: AgentManifest) {
    AgentRegistry.register(manifest);
  },

  registerTool(tool: ITool) {
    ToolRegistry.register(tool);
  },

  async runAgent(agentId: string, initialContextData: any) {
    const context = new AgentContext(initialContextData);
    return await AgentRuntime.startAgent(agentId, context);
  }
};
