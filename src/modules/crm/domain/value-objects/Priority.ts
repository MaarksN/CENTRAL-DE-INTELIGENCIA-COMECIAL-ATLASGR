/**
 * @file Priority.ts
 * @description Value Object Priority imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type PriorityValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export class Priority {
  private static readonly VALID_VALUES: readonly PriorityValue[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  private readonly _value: PriorityValue;

  private constructor(value: PriorityValue) {
    this._value = value;
  }

  public static create(value: PriorityValue): Priority {
    if (!Priority.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid Priority value: ${String(value)}`);
    }
    return new Priority(value);
  }

  public get value(): PriorityValue {
    return this._value;
  }

  public equals(other: Priority): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
