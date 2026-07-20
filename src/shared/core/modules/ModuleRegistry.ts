/**
 * @file ModuleRegistry.ts
 * @description Reusable registry tracking every Module registered into an application's Container.
 */

import type { Container } from '../container/Container.js';
import type { Module } from './Module.js';
import { registerModule } from './Module.js';

export class ModuleRegistry {
  private readonly container: Container;
  private readonly registered = new Set<string>();

  public constructor(container: Container) {
    this.container = container;
  }

  public register(module: Module): void {
    if (this.registered.has(module.name)) {
      return;
    }

    registerModule(this.container, module);
    this.registered.add(module.name);
  }

  public registerMany(modules: ReadonlyArray<Module>): void {
    modules.forEach((module) => this.register(module));
  }

  public isRegistered(moduleName: string): boolean {
    return this.registered.has(moduleName);
  }

  public getRegisteredModuleNames(): ReadonlyArray<string> {
    return [...this.registered];
  }
}