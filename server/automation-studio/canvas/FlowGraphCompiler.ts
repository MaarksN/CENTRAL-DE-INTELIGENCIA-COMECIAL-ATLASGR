export interface FlowNode {
  id: string;
  kind: 'trigger' | 'condition' | 'action';
  refType: string;
  next: string[];
}

export interface CompiledFlow {
  workflowId: string;
  steps: FlowNode[];
}

export class FlowGraphCompiler {
  static compile(workflowId: string, nodes: FlowNode[]): CompiledFlow {
    const triggers = nodes.filter((n) => n.kind === 'trigger');
    if (triggers.length === 0) {
      throw new Error('A flow must contain at least one trigger node.');
    }

    // Mock topological ordering: triggers first, then conditions, then actions
    const order = { trigger: 0, condition: 1, action: 2 } as const;
    const steps = [...nodes].sort((a, b) => order[a.kind] - order[b.kind]);

    return { workflowId, steps };
  }
}
