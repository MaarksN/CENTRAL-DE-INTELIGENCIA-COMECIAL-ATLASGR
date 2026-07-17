export class MemoryManager {
  // Temporary deterministic key-value store for validating the architecture.
  // In Phase 5, this will be abstracted to support VectorDB or Prisma EventStore.
  private static store: Map<string, any[]> = new Map();

  static save(contextId: string, memory: any): void {
    if (!this.store.has(contextId)) {
      this.store.set(contextId, []);
    }
    this.store.get(contextId)!.push({
      ...memory,
      timestamp: new Date()
    });
  }

  static get(contextId: string): any[] {
    return this.store.get(contextId) || [];
  }

  static clear(contextId: string): void {
    this.store.delete(contextId);
  }
}
