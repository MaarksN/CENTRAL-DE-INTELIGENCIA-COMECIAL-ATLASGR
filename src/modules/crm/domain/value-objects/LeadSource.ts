/**
 * @file LeadSource.ts
 * @description Value Object LeadSource imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type LeadSourceValue = 'WEBSITE' | 'REFERRAL' | 'COLD_CALL' | 'SOCIAL_MEDIA' | 'EVENT' | 'ADVERTISEMENT';

export class LeadSource {
  private static readonly VALID_VALUES: readonly LeadSourceValue[] = ['WEBSITE', 'REFERRAL', 'COLD_CALL', 'SOCIAL_MEDIA', 'EVENT', 'ADVERTISEMENT'];

  private readonly _value: LeadSourceValue;

  private constructor(value: LeadSourceValue) {
    this._value = value;
  }

  public static create(value: LeadSourceValue): LeadSource {
    if (!LeadSource.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid LeadSource value: ${String(value)}`);
    }
    return new LeadSource(value);
  }

  public get value(): LeadSourceValue {
    return this._value;
  }

  public equals(other: LeadSource): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
