export interface RegisteredModule {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'disabled';
}

export class ModuleKernel {
  private static modules: Map<string, RegisteredModule> = new Map();

  static register(module: RegisteredModule): void {
    this.modules.set(module.id, module);
  }

  static list(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }

  static disable(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (module) module.status = 'disabled';
  }
}
