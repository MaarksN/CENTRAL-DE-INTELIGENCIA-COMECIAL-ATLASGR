/**
 * @file Deal.ts
 * @description Entidade de dominio Deal do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Money } from '../value-objects/Money';

export interface DealProps {
  readonly title: string;
  readonly amount: Money;
  readonly status: string;
  readonly closedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Deal {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _amount: Money;
  private readonly _status: string;
  private readonly _closedAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: DealProps) {
    this._id = id;
    this._title = props.title;
    this._amount = props.amount;
    this._status = props.status;
    this._closedAt = props.closedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: DealProps): Deal {
    return new Deal(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get status(): string {
    return this._status;
  }

  public get closedAt(): Date | null {
    return this._closedAt;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public touch(): void {
    this._updatedAt = new Date();
  }

  public equals(other: Deal): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      amount: this._amount,
      status: this._status,
      closedAt: this._closedAt,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
