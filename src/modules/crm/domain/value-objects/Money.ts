/**
 * @file Money.ts
 * @description Value Object Money imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  public static create(amount: number, currency: string = 'BRL'): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    return new Money(amount, currency);
  }

  public get amount(): number {
    return this._amount;
  }

  public get currency(): string {
    return this._currency;
  }

  public add(other: Money): Money {
    if (this._currency !== other.currency) {
      throw new Error('Cannot add Money with different currencies');
    }
    return new Money(this._amount + other.amount, this._currency);
  }

  public subtract(other: Money): Money {
    if (this._currency !== other.currency) {
      throw new Error('Cannot subtract Money with different currencies');
    }
    return new Money(this._amount - other.amount, this._currency);
  }

  public equals(other: Money): boolean {
    return this._amount === other.amount && this._currency === other.currency;
  }

  public toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
