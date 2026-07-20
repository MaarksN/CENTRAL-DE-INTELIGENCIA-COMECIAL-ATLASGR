/**
 * @file SocialNetwork.ts
 * @description Value Object SocialNetwork imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class SocialNetwork {
  private static readonly PATTERN: RegExp = /^https?:\/\/.+$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): SocialNetwork {
    if (!SocialNetwork.PATTERN.test(value)) {
      throw new Error(`Invalid SocialNetwork: ${value}`);
    }
    return new SocialNetwork(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: SocialNetwork): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
