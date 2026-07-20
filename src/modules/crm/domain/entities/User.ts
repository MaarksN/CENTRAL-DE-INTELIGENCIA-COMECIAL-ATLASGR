/**
 * @file User.ts
 * @description Entidade de dominio User do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { EmailAddress } from '../value-objects/EmailAddress';

export interface UserProps {
  readonly fullName: string;
  readonly email: EmailAddress;
  readonly role: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class User {
  private readonly _id: string;
  private readonly _fullName: string;
  private readonly _email: EmailAddress;
  private readonly _role: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: UserProps) {
    this._id = id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: UserProps): User {
    return new User(id, props);
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

  public get role(): string {
    return this._role;
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

  public equals(other: User): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      fullName: this._fullName,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
