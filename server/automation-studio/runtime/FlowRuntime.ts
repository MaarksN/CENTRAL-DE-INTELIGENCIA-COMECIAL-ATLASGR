import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';
import { CompiledFlow } from '../canvas/FlowGraphCompiler.js';

export class FlowRuntime {
  static async publishTestRun(flow: CompiledFlow): Promise<string> {
    return eventBus.publish({
      eventType: 'automation_studio.flow.test_run',
      source: 'FlowRuntime',
      payload: { workflowId: flow.workflowId, stepCount: flow.steps.length },
    });
  }
}
