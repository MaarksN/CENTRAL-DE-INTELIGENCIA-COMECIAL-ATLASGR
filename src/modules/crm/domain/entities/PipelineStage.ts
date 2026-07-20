/**
 * @file PipelineStage.ts
 * @description Entidade de dominio PipelineStage do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Percentage } from '../value-objects/Percentage';
import type { PipelineOrder } from '../value-objects/PipelineOrder';

export interface PipelineStageProps {
  readonly name: string;
  readonly order: PipelineOrder;
  readonly pipelineId: string;
  readonly winProbability: Percentage;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class PipelineStage {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _order: PipelineOrder;
  private readonly _pipelineId: string;
  private readonly _winProbability: Percentage;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: PipelineStageProps) {
    this._id = id;
    this._name = props.name;
    this._order = props.order;
    this._pipelineId = props.pipelineId;
    this._winProbability = props.winProbability;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: PipelineStageProps): PipelineStage {
    return new PipelineStage(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get order(): PipelineOrder {
    return this._order;
  }

  public get pipelineId(): string {
    return this._pipelineId;
  }

  public get winProbability(): Percentage {
    return this._winProbability;
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

  public equals(other: PipelineStage): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      order: this._order,
      pipelineId: this._pipelineId,
      winProbability: this._winProbability,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
