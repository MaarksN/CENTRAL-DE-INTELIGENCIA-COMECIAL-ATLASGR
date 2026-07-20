/**
 * @file Container.ts
 * @description Lightweight, reusable Dependency Injection container.
 */

import { ServiceLifetime } from './ServiceLifetime.js';
import type { ServiceDescriptor, ServiceFactory } from './ServiceDescriptor.js';
import type { ServiceToken } from './ServiceToken.js';

export class ServiceNotRegisteredError extends Error {
  public constructor(token: string) {
    super(`No service registered for token "${token}".`);
    this.name = 'ServiceNotRegisteredError';
  }
}

/**
 * Lightweight, reusable Dependency Injection container.
 * Preparado para: singleton, transient, scoped, factories, resolução por token.
 */
export class Container {
  private readonly descriptors = new Map<string, ServiceDescriptor<unknown>>();
  private readonly singletons = new Map<string, unknown>();
  private readonly scopedInstances = new Map<string, unknown>();
  private readonly parent?: Container;

  public constructor(parent?: Container) {
    this.parent = parent;
  }

  public register<TService>(
    token: ServiceToken<TService>,
    factory: ServiceFactory<TService>,
    lifetime: ServiceLifetime = ServiceLifetime.Transient,
  ): void {
    this.descriptors.set(token.toString(), { factory, lifetime } as ServiceDescriptor<unknown>);
  }

  public registerSingleton<TService>(token: ServiceToken<TService>, factory: ServiceFactory<TService>): void {
    this.register(token, factory, ServiceLifetime.Singleton);
  }

  public registerTransient<TService>(token: ServiceToken<TService>, factory: ServiceFactory<TService>): void {
    this.register(token, factory, ServiceLifetime.Transient);
  }

  public registerScoped<TService>(token: ServiceToken<TService>, factory: ServiceFactory<TService>): void {
    this.register(token, factory, ServiceLifetime.Scoped);
  }

  public registerInstance<TService>(token: ServiceToken<TService>, instance: TService): void {
    this.singletons.set(token.toString(), instance);
    this.descriptors.set(token.toString(), {
      lifetime: ServiceLifetime.Singleton,
      factory: () => instance,
    } as ServiceDescriptor<unknown>);
  }

  public resolve<TService>(token: ServiceToken<TService>): TService {
    const key = token.toString();
    const descriptor = this.descriptors.get(key) ?? this.parent?.tryGetDescriptor(key);

    if (!descriptor) {
      throw new ServiceNotRegisteredError(key);
    }

    switch (descriptor.lifetime) {
      case ServiceLifetime.Singleton: {
        if (!this.singletons.has(key)) {
          this.singletons.set(key, descriptor.factory(this));
        }
        return this.singletons.get(key) as TService;
      }

      case ServiceLifetime.Scoped: {
        if (!this.scopedInstances.has(key)) {
          this.scopedInstances.set(key, descriptor.factory(this));
        }
        return this.scopedInstances.get(key) as TService;
      }

      case ServiceLifetime.Transient:
      default:
        return descriptor.factory(this) as TService;
    }
  }

  public isRegistered<TService>(token: ServiceToken<TService>): boolean {
    return this.descriptors.has(token.toString()) || (this.parent?.isRegistered(token) ?? false);
  }

  public createScope(): Container {
    return new Container(this);
  }

  protected tryGetDescriptor(key: string): ServiceDescriptor<unknown> | undefined {
    return this.descriptors.get(key) ?? this.parent?.tryGetDescriptor(key);
  }
}