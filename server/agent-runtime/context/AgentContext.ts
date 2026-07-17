export class AgentContext {
  public data: Map<string, any>;

  constructor(initialData?: any) {
    this.data = new Map();
    if (initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        this.data.set(key, value);
      }
    }
  }

  get(key: string): any {
    return this.data.get(key);
  }

  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.data.entries());
  }
}
