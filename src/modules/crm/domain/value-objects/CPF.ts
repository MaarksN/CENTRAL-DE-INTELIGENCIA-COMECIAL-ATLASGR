/**
 * @file CPF.ts
 * @description Value Object CPF imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class CPF {
  private static readonly PATTERN: RegExp = /^\d{11}$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): CPF {
    const digitsOnly: string = value.replace(/\D/g, '');
    if (!CPF.PATTERN.test(digitsOnly)) {
      throw new Error(`Invalid CPF: ${value}`);
    }
    return new CPF(digitsOnly);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: CPF): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
