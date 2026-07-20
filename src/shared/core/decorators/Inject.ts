/**
 * @file Inject.ts
 * @description Parameter decorator binding a constructor parameter to a service token.
 */

import type { ServiceToken } from '../container/ServiceToken.js';

const INJECT_METADATA_KEY = Symbol('inject-tokens');

export function Inject<TService>(token: ServiceToken<TService>): ParameterDecorator {
  return (target: object, _propertyKey: string | symbol | undefined, parameterIndex: number) => {
    const existing: Array<{ index: number; token: ServiceToken<unknown> }> =
      Reflect.getMetadata?.(INJECT_METADATA_KEY, target) ?? [];

    existing.push({ index: parameterIndex, token });
    Reflect.defineMetadata?.(INJECT_METADATA_KEY, existing, target);
  };
}

export function getInjectedTokens(
  target: object,
): ReadonlyArray<{ index: number; token: ServiceToken<unknown> }> {
  return Reflect.getMetadata?.(INJECT_METADATA_KEY, target) ?? [];
}