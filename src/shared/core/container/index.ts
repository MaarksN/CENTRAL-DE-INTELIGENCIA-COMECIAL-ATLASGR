/**
 * @file index.ts
 * @description Public API surface of the Core container module.
 */

export { ServiceToken, createToken } from './ServiceToken.js';
export { ServiceLifetime } from './ServiceLifetime.js';
export type { ServiceDescriptor, ServiceFactory } from './ServiceDescriptor.js';
export { Container, ServiceNotRegisteredError } from './Container.js';