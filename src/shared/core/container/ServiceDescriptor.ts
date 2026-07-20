/**
 * @file ServiceDescriptor.ts
 * @description Describes how a service should be constructed and its lifetime.
 */

import type { ServiceLifetime } from './ServiceLifetime.js';
import type { Container } from './Container.js';

export type ServiceFactory<TService> = (container: Container) => TService;

export interface ServiceDescriptor<TService> {
  readonly lifetime: ServiceLifetime;
  readonly factory: ServiceFactory<TService>;
}