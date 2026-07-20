/**
 * @file Lead.ts
 * @description Entidade de dominio Lead do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { EmailAddress } from '../value-objects/EmailAddress';
import type { LeadScore } from '../value-objects/LeadScore';
import type { LeadSource } from '../value-objects/LeadSource';
import type { LeadStatus } from '../value-objects/LeadStatus';
import type { LeadTemperature } from '../value-objects/LeadTemperature';
import type { Phone } from '../value-objects/Phone';

export interface LeadProps {
  readonly name: string;
  readonly email: EmailAddress;
  readonly phone: Phone;
  readonly status: LeadStatus;
  readonly source: LeadSource;
  readonly score: LeadScore;
  readonly temperature: LeadTemperature;
  readonly companyId: string | null;
  readonly assignedTo: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Lead {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _email: EmailAddress;
  private readonly _phone: Phone;
  private readonly _status: LeadStatus;
  private readonly _source: LeadSource;
  private readonly _score: LeadScore;
  private readonly _temperature: LeadTemperature;
  private readonly _companyId: string | null;
  private readonly _assignedTo: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: LeadProps) {
    this._id = id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._status = props.status;
    this._source = props.source;
    this._score = props.score;
    this._temperature = props.temperature;
    this._companyId = props.companyId;
    this._assignedTo = props.assignedTo;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: LeadProps): Lead {
    return new Lead(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): EmailAddress {
    return this._email;
  }

  public get phone(): Phone {
    return this._phone;
  }

  public get status(): LeadStatus {
    return this._status;
  }

  public get source(): LeadSource {
    return this._source;
  }

  public get score(): LeadScore {
    return this._score;
  }

  public get temperature(): LeadTemperature {
    return this._temperature;
  }

  public get companyId(): string | null {
    return this._companyId;
  }

  public get assignedTo(): string | null {
    return this._assignedTo;
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

  public equals(other: Lead): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      status: this._status,
      source: this._source,
      score: this._score,
      temperature: this._temperature,
      companyId: this._companyId,
      assignedTo: this._assignedTo,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
