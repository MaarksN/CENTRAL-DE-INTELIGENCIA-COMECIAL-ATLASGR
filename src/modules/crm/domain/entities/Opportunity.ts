/**
 * @file Opportunity.ts
 * @description Entidade de dominio Opportunity do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Money } from '../value-objects/Money';
import type { Percentage } from '../value-objects/Percentage';

export interface OpportunityProps {
  readonly title: string;
  readonly amount: Money;
  readonly stageId: string;
  readonly pipelineId: string;
  readonly probability: Percentage;
  readonly closeDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Opportunity {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _amount: Money;
  private readonly _stageId: string;
  private readonly _pipelineId: string;
  private readonly _probability: Percentage;
  private readonly _closeDate: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: OpportunityProps) {
    this._id = id;
    this._title = props.title;
    this._amount = props.amount;
    this._stageId = props.stageId;
    this._pipelineId = props.pipelineId;
    this._probability = props.probability;
    this._closeDate = props.closeDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: OpportunityProps): Opportunity {
    return new Opportunity(id, props);
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

  public get stageId(): string {
    return this._stageId;
  }

  public get pipelineId(): string {
    return this._pipelineId;
  }

  public get probability(): Percentage {
    return this._probability;
  }

  public get closeDate(): Date {
    return this._closeDate;
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

  public equals(other: Opportunity): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      amount: this._amount,
      stageId: this._stageId,
      pipelineId: this._pipelineId,
      probability: this._probability,
      closeDate: this._closeDate,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
