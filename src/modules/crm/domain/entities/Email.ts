/**
 * @file Email.ts
 * @description Entidade de dominio Email do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { EmailAddress } from '../value-objects/EmailAddress';

export interface EmailProps {
  readonly subject: string;
  readonly body: string;
  readonly from: EmailAddress;
  readonly to: EmailAddress[];
  readonly sentAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Email {
  private readonly _id: string;
  private readonly _subject: string;
  private readonly _body: string;
  private readonly _from: EmailAddress;
  private readonly _to: EmailAddress[];
  private readonly _sentAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: EmailProps) {
    this._id = id;
    this._subject = props.subject;
    this._body = props.body;
    this._from = props.from;
    this._to = props.to;
    this._sentAt = props.sentAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: EmailProps): Email {
    return new Email(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get subject(): string {
    return this._subject;
  }

  public get body(): string {
    return this._body;
  }

  public get from(): EmailAddress {
    return this._from;
  }

  public get to(): EmailAddress[] {
    return this._to;
  }

  public get sentAt(): Date | null {
    return this._sentAt;
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

  public equals(other: Email): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      subject: this._subject,
      body: this._body,
      from: this._from,
      to: this._to,
      sentAt: this._sentAt,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
