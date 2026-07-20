/**
 * @file PipelineOrder.ts
 * @description Value Object PipelineOrder imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class PipelineOrder {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value: number): PipelineOrder {
    if (value < 0 || value > 999) {
      throw new Error(`PipelineOrder must be between 0 and 999`);
    }
    return new PipelineOrder(value);
  }

  public get value(): number {
    return this._value;
  }

  public equals(other: PipelineOrder): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
