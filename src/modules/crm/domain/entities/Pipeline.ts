/**
 * @file Pipeline.ts
 * @description Entidade de dominio Pipeline do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface PipelineProps {
  readonly name: string;
  readonly type: string;
  readonly stages: PipelineStage[];
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Pipeline {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _type: string;
  private readonly _stages: PipelineStage[];
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: PipelineProps) {
    this._id = id;
    this._name = props.name;
    this._type = props.type;
    this._stages = props.stages;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: PipelineProps): Pipeline {
    return new Pipeline(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): string {
    return this._type;
  }

  public get stages(): PipelineStage[] {
    return this._stages;
  }

  public get isActive(): boolean {
    return this._isActive;
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

  public equals(other: Pipeline): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      stages: this._stages,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
