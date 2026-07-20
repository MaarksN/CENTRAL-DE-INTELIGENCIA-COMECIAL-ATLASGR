/**
 * @file CNPJ.ts
 * @description Value Object CNPJ imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class CNPJ {
  private static readonly PATTERN: RegExp = /^\d{14}$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): CNPJ {
    const digitsOnly: string = value.replace(/\D/g, '');
    if (!CNPJ.PATTERN.test(digitsOnly)) {
      throw new Error(`Invalid CNPJ: ${value}`);
    }
    return new CNPJ(digitsOnly);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: CNPJ): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
