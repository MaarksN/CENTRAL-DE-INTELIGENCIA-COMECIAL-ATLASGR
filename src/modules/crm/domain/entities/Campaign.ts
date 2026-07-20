/**
 * @file Campaign.ts
 * @description Entidade de dominio Campaign do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Money } from '../value-objects/Money';

export interface CampaignProps {
  readonly name: string;
  readonly budget: Money;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Campaign {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _budget: Money;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: CampaignProps) {
    this._id = id;
    this._name = props.name;
    this._budget = props.budget;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: CampaignProps): Campaign {
    return new Campaign(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get budget(): Money {
    return this._budget;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public get endDate(): Date {
    return this._endDate;
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

  public equals(other: Campaign): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      budget: this._budget,
      startDate: this._startDate,
      endDate: this._endDate,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
