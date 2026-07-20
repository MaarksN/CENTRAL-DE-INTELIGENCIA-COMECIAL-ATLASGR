/**
 * @file Contact.ts
 * @description Entidade de dominio Contact do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { EmailAddress } from '../value-objects/EmailAddress';
import type { Phone } from '../value-objects/Phone';

export interface ContactProps {
  readonly fullName: string;
  readonly email: EmailAddress;
  readonly phone: Phone;
  readonly companyId: string;
  readonly isPrimary: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Contact {
  private readonly _id: string;
  private readonly _fullName: string;
  private readonly _email: EmailAddress;
  private readonly _phone: Phone;
  private readonly _companyId: string;
  private readonly _isPrimary: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: ContactProps) {
    this._id = id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._phone = props.phone;
    this._companyId = props.companyId;
    this._isPrimary = props.isPrimary;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: ContactProps): Contact {
    return new Contact(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get fullName(): string {
    return this._fullName;
  }

  public get email(): EmailAddress {
    return this._email;
  }

  public get phone(): Phone {
    return this._phone;
  }

  public get companyId(): string {
    return this._companyId;
  }

  public get isPrimary(): boolean {
    return this._isPrimary;
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

  public equals(other: Contact): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      fullName: this._fullName,
      email: this._email,
      phone: this._phone,
      companyId: this._companyId,
      isPrimary: this._isPrimary,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
