/**
 * @file Activity.ts
 * @description Entidade de dominio Activity do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { ActivityType } from '../value-objects/ActivityType';

export interface ActivityProps {
  readonly type: ActivityType;
  readonly subject: string;
  readonly relatedTo: string;
  readonly dueDate: Date;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Activity {
  private readonly _id: string;
  private readonly _type: ActivityType;
  private readonly _subject: string;
  private readonly _relatedTo: string;
  private readonly _dueDate: Date;
  private readonly _status: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: ActivityProps) {
    this._id = id;
    this._type = props.type;
    this._subject = props.subject;
    this._relatedTo = props.relatedTo;
    this._dueDate = props.dueDate;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: ActivityProps): Activity {
    return new Activity(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get type(): ActivityType {
    return this._type;
  }

  public get subject(): string {
    return this._subject;
  }

  public get relatedTo(): string {
    return this._relatedTo;
  }

  public get dueDate(): Date {
    return this._dueDate;
  }

  public get status(): string {
    return this._status;
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

  public equals(other: Activity): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      type: this._type,
      subject: this._subject,
      relatedTo: this._relatedTo,
      dueDate: this._dueDate,
      status: this._status,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
