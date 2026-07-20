/**
 * @file Proposal.ts
 * @description Entidade de dominio Proposal do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Money } from '../value-objects/Money';

export interface ProposalProps {
  readonly title: string;
  readonly amount: Money;
  readonly validUntil: Date;
  readonly status: string;
  readonly opportunityId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Proposal {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _amount: Money;
  private readonly _validUntil: Date;
  private readonly _status: string;
  private readonly _opportunityId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: ProposalProps) {
    this._id = id;
    this._title = props.title;
    this._amount = props.amount;
    this._validUntil = props.validUntil;
    this._status = props.status;
    this._opportunityId = props.opportunityId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: ProposalProps): Proposal {
    return new Proposal(id, props);
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

  public get validUntil(): Date {
    return this._validUntil;
  }

  public get status(): string {
    return this._status;
  }

  public get opportunityId(): string {
    return this._opportunityId;
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

  public equals(other: Proposal): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      amount: this._amount,
      validUntil: this._validUntil,
      status: this._status,
      opportunityId: this._opportunityId,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
