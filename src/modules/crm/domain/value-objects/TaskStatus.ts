/**
 * @file TaskStatus.ts
 * @description Value Object TaskStatus imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type TaskStatusValue = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export class TaskStatus {
  private static readonly VALID_VALUES: readonly TaskStatusValue[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  private readonly _value: TaskStatusValue;

  private constructor(value: TaskStatusValue) {
    this._value = value;
  }

  public static create(value: TaskStatusValue): TaskStatus {
    if (!TaskStatus.VALID_VALUES.includes(value)) {
      throw new Error(`Invalid TaskStatus value: ${String(value)}`);
    }
    return new TaskStatus(value);
  }

  public get value(): TaskStatusValue {
    return this._value;
  }

  public equals(other: TaskStatus): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
