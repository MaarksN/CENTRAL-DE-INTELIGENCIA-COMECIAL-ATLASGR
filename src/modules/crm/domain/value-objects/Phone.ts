/**
 * @file Phone.ts
 * @description Value Object Phone imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class Phone {
  private static readonly PATTERN: RegExp = /^\+?[0-9]{10,15}$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Phone {
    if (!Phone.PATTERN.test(value)) {
      throw new Error(`Invalid Phone: ${value}`);
    }
    return new Phone(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Phone): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
