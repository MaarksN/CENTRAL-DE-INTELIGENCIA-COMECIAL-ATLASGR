export interface GraphNode {
  id: string;
  type: 'account' | 'contact' | 'deal';
}

export interface GraphEdge {
  from: string;
  to: string;
  relation: 'employs' | 'owns' | 'influences';
}

export class EntityGraphBuilder {
  static build(nodes: GraphNode[], edges: GraphEdge[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const validEdges = edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
    return { nodes, edges: validEdges };
  }
}
