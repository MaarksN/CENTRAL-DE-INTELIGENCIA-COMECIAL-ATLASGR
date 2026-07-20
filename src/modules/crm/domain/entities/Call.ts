/**
 * @file Call.ts
 * @description Entidade de dominio Call do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface CallProps {
  readonly duration: number;
  readonly outcome: string;
  readonly contactId: string;
  readonly scheduledAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Call {
  private readonly _id: string;
  private readonly _duration: number;
  private readonly _outcome: string;
  private readonly _contactId: string;
  private readonly _scheduledAt: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: CallProps) {
    this._id = id;
    this._duration = props.duration;
    this._outcome = props.outcome;
    this._contactId = props.contactId;
    this._scheduledAt = props.scheduledAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: CallProps): Call {
    return new Call(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get duration(): number {
    return this._duration;
  }

  public get outcome(): string {
    return this._outcome;
  }

  public get contactId(): string {
    return this._contactId;
  }

  public get scheduledAt(): Date {
    return this._scheduledAt;
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

  public equals(other: Call): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      duration: this._duration,
      outcome: this._outcome,
      contactId: this._contactId,
      scheduledAt: this._scheduledAt,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
