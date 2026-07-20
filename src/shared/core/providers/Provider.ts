/**
 * @file Provider.ts
 * @description Reusable abstraction describing how to provide/register a dependency in the container.
 */

import type { Container } from '../container/Container.js';
import type { ServiceToken } from '../container/ServiceToken.js';
import { ServiceLifetime } from '../container/ServiceLifetime.js';
import type { ServiceFactory } from '../container/ServiceDescriptor.js';

export interface Provider<TService> {
  readonly token: ServiceToken<TService>;
  readonly lifetime: ServiceLifetime;
  readonly factory: ServiceFactory<TService>;
}

export function createProvider<TService>(
  token: ServiceToken<TService>,
  factory: ServiceFactory<TService>,
  lifetime: ServiceLifetime = ServiceLifetime.Transient,
): Provider<TService> {
  return { token, lifetime, factory };
}

export function applyProvider<TService>(container: Container, provider: Provider<TService>): void {
  container.register(provider.token, provider.factory, provider.lifetime);
}