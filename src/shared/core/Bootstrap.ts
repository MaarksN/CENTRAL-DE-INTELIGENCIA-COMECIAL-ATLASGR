/**
 * @file Bootstrap.ts
 * @description Reusable application bootstrap orchestrator wiring Container, Modules and lifecycle hooks.
 */

import { Container } from './container/Container.js';
import { ModuleRegistry } from './modules/ModuleRegistry.js';
import type { Module } from './modules/Module.js';

export type BootstrapHook = (container: Container) => Promise<void> | void;

export class Bootstrap {
  public readonly container: Container;
  private readonly moduleRegistry: ModuleRegistry;
  private readonly beforeStartHooks: BootstrapHook[] = [];
  private readonly afterStartHooks: BootstrapHook[] = [];

  public constructor(container: Container = new Container()) {
    this.container = container;
    this.moduleRegistry = new ModuleRegistry(container);
  }

  public useModules(modules: ReadonlyArray<Module>): this {
    this.moduleRegistry.registerMany(modules);
    return this;
  }

  public beforeStart(hook: BootstrapHook): this {
    this.beforeStartHooks.push(hook);
    return this;
  }

  public afterStart(hook: BootstrapHook): this {
    this.afterStartHooks.push(hook);
    return this;
  }

  public async start(): Promise<Container> {
    for (const hook of this.beforeStartHooks) {
      await hook(this.container);
    }

    for (const hook of this.afterStartHooks) {
      await hook(this.container);
    }

    return this.container;
  }

  public getModuleRegistry(): ModuleRegistry {
    return this.moduleRegistry;
  }
}