/**
 * @file LeadStatus.ts
 * @description Value Object LeadStatus imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type LeadStatusValue = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'WON' | 'LOST';

export class LeadStatus {
  private static readonly VALID_VALUES: readonly LeadStatusValue[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'WON', 'LOST'];

  private readonly _value: LeadStatusValue;

  private constructor(value: LeadStatusValue) {
    this._value = value;
  }

  public static create(value: LeadStatusValue): LeadStatus {
    if (!LeadStatus.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid LeadStatus value: ${String(value)}`);
    }
    return new LeadStatus(value);
  }

  public get value(): LeadStatusValue {
    return this._value;
  }

  public equals(other: LeadStatus): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
