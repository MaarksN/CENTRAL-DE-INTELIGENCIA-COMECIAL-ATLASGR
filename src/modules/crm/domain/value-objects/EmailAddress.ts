/**
 * @file EmailAddress.ts
 * @description Value Object EmailAddress imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class EmailAddress {
  private static readonly PATTERN: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): EmailAddress {
    if (!EmailAddress.PATTERN.test(value)) {
      throw new Error(`Invalid EmailAddress: ${value}`);
    }
    return new EmailAddress(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: EmailAddress): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
