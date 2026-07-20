/**
 * @file LeadTemperature.ts
 * @description Value Object LeadTemperature imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type LeadTemperatureValue = 'COLD' | 'WARM' | 'HOT';

export class LeadTemperature {
  private static readonly VALID_VALUES: readonly LeadTemperatureValue[] = ['COLD', 'WARM', 'HOT'];

  private readonly _value: LeadTemperatureValue;

  private constructor(value: LeadTemperatureValue) {
    this._value = value;
  }

  public static create(value: LeadTemperatureValue): LeadTemperature {
    if (!LeadTemperature.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid LeadTemperature value: ${String(value)}`);
    }
    return new LeadTemperature(value);
  }

  public get value(): LeadTemperatureValue {
    return this._value;
  }

  public equals(other: LeadTemperature): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
