/**
 * @file Meeting.ts
 * @description Entidade de dominio Meeting do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface MeetingProps {
  readonly title: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly participants: string[];
  readonly location: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Meeting {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _startTime: Date;
  private readonly _endTime: Date;
  private readonly _participants: string[];
  private readonly _location: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: MeetingProps) {
    this._id = id;
    this._title = props.title;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._participants = props.participants;
    this._location = props.location;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: MeetingProps): Meeting {
    return new Meeting(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get startTime(): Date {
    return this._startTime;
  }

  public get endTime(): Date {
    return this._endTime;
  }

  public get participants(): string[] {
    return this._participants;
  }

  public get location(): string {
    return this._location;
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

  public equals(other: Meeting): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      startTime: this._startTime,
      endTime: this._endTime,
      participants: this._participants,
      location: this._location,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
