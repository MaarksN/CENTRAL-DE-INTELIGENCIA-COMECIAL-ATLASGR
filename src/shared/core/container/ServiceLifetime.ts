/**
 * @file ServiceLifetime.ts
 * @description Enumeration of supported service lifetimes within the DI container.
 */

export enum ServiceLifetime {
  Singleton = 'singleton',
  Transient = 'transient',
  Scoped = 'scoped',
}