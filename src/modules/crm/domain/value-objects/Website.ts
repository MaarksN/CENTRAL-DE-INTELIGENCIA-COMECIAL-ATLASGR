/**
 * @file Website.ts
 * @description Value Object Website imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class Website {
  private static readonly PATTERN: RegExp = /^https?:\/\/[\w.-]+\.[a-z]{2,}([\/\w.-]*)*\/?$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Website {
    if (!Website.PATTERN.test(value)) {
      throw new Error(`Invalid Website: ${value}`);
    }
    return new Website(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Website): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
