/**
 * @file Timeline.ts
 * @description Entidade de dominio Timeline do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface TimelineProps {
  readonly entityId: string;
  readonly events: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Timeline {
  private readonly _id: string;
  private readonly _entityId: string;
  private readonly _events: string[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: TimelineProps) {
    this._id = id;
    this._entityId = props.entityId;
    this._events = props.events;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: TimelineProps): Timeline {
    return new Timeline(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get entityId(): string {
    return this._entityId;
  }

  public get events(): string[] {
    return this._events;
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

  public equals(other: Timeline): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      entityId: this._entityId,
      events: this._events,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
