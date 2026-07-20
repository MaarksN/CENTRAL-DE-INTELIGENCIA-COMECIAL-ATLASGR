/**
 * @file Module.ts
 * @description Reusable contract for a bounded set of providers registered together in the container.
 */

import type { Container } from '../container/Container.js';
import type { Provider } from '../providers/Provider.js';
import { applyProvider } from '../providers/Provider.js';

export interface Module {
  readonly name: string;
  readonly providers: ReadonlyArray<Provider<unknown>>;
  readonly imports?: ReadonlyArray<Module>;
}

export function registerModule(container: Container, module: Module): void {
  module.imports?.forEach((importedModule) => registerModule(container, importedModule));
  module.providers.forEach((provider) => applyProvider(container, provider));
}

export function defineModule(input: {
  readonly name: string;
  readonly providers: ReadonlyArray<Provider<unknown>>;
  readonly imports?: ReadonlyArray<Module>;
}): Module {
  return {
    name: input.name,
    providers: input.providers,
    imports: input.imports,
  };
}