import { AgentManifest } from '../core/AgentManifest.js';
import { AgentContext } from '../context/AgentContext.js';
import { AIProvider } from '../providers/AIProvider.js';
import { ToolRegistry } from '../tools/ToolRegistry.js';

export interface ExecutionPlan {
  tasks: string[];
}

export class Planner {
  static async createPlan(agent: AgentManifest, context: AgentContext, provider: AIProvider): Promise<ExecutionPlan> {
    // Determine which tools are available to this agent
    const availableTools = agent.supportedTools.map(t => ToolRegistry.get(t)).filter(Boolean);

    // AI Provider creates the plan based on Context and Tools
    const prompt = `Create an execution plan for agent ${agent.name}. 
Context: ${JSON.stringify(context.getAll())}.
Available Tools: ${availableTools.map(t => t?.manifest.name).join(', ')}.`;

    const response = await provider.generate({ prompt });
    console.log(`[Planner] Plan created via ${provider.name}: ${response}`);

    // Deterministic mock plan parsing
    return {
      tasks: ['task_1', 'task_2'] // Mocked tasks
    };
  }

  static async executePlan(plan: ExecutionPlan, context: AgentContext, provider: AIProvider): Promise<void> {
    for (const task of plan.tasks) {
      console.log(`[Planner] Executing ${task}`);
      // In a real environment, the provider would select a tool for each task.
      // Here we just mock the provider processing the task.
      await provider.generate({ prompt: `Execute task: ${task}` });
    }
  }
}
