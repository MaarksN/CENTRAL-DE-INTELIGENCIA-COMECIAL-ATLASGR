/**
 * @file ActivityType.ts
 * @description Value Object ActivityType imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type ActivityTypeValue = 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';

export class ActivityType {
  private static readonly VALID_VALUES: readonly ActivityTypeValue[] = ['CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE'];

  private readonly _value: ActivityTypeValue;

  private constructor(value: ActivityTypeValue) {
    this._value = value;
  }

  public static create(value: ActivityTypeValue): ActivityType {
    if (!ActivityType.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid ActivityType value: ${String(value)}`);
    }
    return new ActivityType(value);
  }

  public get value(): ActivityTypeValue {
    return this._value;
  }

  public equals(other: ActivityType): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
