/**
 * @file Injectable.ts
 * @description Marker decorator identifying a class as injectable by the DI container.
 */

const INJECTABLE_METADATA_KEY = Symbol('injectable');

export function Injectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata?.(INJECTABLE_METADATA_KEY, true, target);
  };
}

export function isInjectable(target: object): boolean {
  return Reflect.getMetadata?.(INJECTABLE_METADATA_KEY, target) === true;
}