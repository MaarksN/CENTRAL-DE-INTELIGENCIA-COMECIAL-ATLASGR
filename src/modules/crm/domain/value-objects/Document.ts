/**
 * @file Document.ts
 * @description Value Object Document imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class Document {
  private static readonly PATTERN: RegExp = /^[A-Za-z0-9.-\/]{5,20}$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Document {
    if (!Document.PATTERN.test(value)) {
      throw new Error(`Invalid Document: ${value}`);
    }
    return new Document(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Document): boolean {
    return this._value === other.value;
  }

  public toString(): string {
    return this._value;
  }
}
