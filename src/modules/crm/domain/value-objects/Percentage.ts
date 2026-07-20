/**
 * @file Percentage.ts
 * @description Value Object Percentage imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class Percentage {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value: number): Percentage {
    if (value < 0 || value > 100) {
      throw new Error(`Percentage must be between 0 and 100`);
    }
    return new Percentage(value);
  }

  public get value(): number {
    return this._value;
  }

  public equals(other: Percentage): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
