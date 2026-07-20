/**
 * @file ServiceToken.ts
 * @description Typed token used to identify services registered in the DI container.
 */

export class ServiceToken<TService> {
  public readonly description: string;
  private readonly brand?: TService;

  public constructor(description: string) {
    this.description = description;
  }

  public toString(): string {
    return `ServiceToken(${this.description})`;
  }
}

export function createToken<TService>(description: string): ServiceToken<TService> {
  return new ServiceToken<TService>(description);
}