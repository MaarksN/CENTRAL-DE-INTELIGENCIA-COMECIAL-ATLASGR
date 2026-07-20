/**
 * @file Segment.ts
 * @description Entidade de dominio Segment do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface SegmentProps {
  readonly name: string;
  readonly criteria: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Segment {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _criteria: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: SegmentProps) {
    this._id = id;
    this._name = props.name;
    this._criteria = props.criteria;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: SegmentProps): Segment {
    return new Segment(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get criteria(): string {
    return this._criteria;
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

  public equals(other: Segment): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      criteria: this._criteria,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
