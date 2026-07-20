/**
 * @file Organization.ts
 * @description Entidade de dominio Organization do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Address } from '../value-objects/Address';
import type { CNPJ } from '../value-objects/CNPJ';

export interface OrganizationProps {
  readonly name: string;
  readonly cnpj: CNPJ;
  readonly address: Address;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Organization {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _cnpj: CNPJ;
  private readonly _address: Address;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: OrganizationProps) {
    this._id = id;
    this._name = props.name;
    this._cnpj = props.cnpj;
    this._address = props.address;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: OrganizationProps): Organization {
    return new Organization(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get cnpj(): CNPJ {
    return this._cnpj;
  }

  public get address(): Address {
    return this._address;
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

  public equals(other: Organization): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      cnpj: this._cnpj,
      address: this._address,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
