import { CompiledFlow } from '../canvas/FlowGraphCompiler.js';

export interface FlowVersion {
  version: number;
  flow: CompiledFlow;
  createdAt: Date;
}

export class FlowVersionControl {
  private static history: Map<string, FlowVersion[]> = new Map();

  static snapshot(flow: CompiledFlow): FlowVersion {
    const versions = this.history.get(flow.workflowId) ?? [];
    const version: FlowVersion = { version: versions.length + 1, flow, createdAt: new Date() };
    versions.push(version);
    this.history.set(flow.workflowId, versions);
    return version;
  }

  static getHistory(workflowId: string): FlowVersion[] {
    return this.history.get(workflowId) ?? [];
  }
}
