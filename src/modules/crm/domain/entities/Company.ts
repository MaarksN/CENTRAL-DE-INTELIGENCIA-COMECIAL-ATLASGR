/**
 * @file Company.ts
 * @description Entidade de dominio Company do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Address } from '../value-objects/Address';
import type { CNPJ } from '../value-objects/CNPJ';
import type { Website } from '../value-objects/Website';

export interface CompanyProps {
  readonly legalName: string;
  readonly tradeName: string;
  readonly cnpj: CNPJ;
  readonly website: Website;
  readonly address: Address;
  readonly segment: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Company {
  private readonly _id: string;
  private readonly _legalName: string;
  private readonly _tradeName: string;
  private readonly _cnpj: CNPJ;
  private readonly _website: Website;
  private readonly _address: Address;
  private readonly _segment: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: CompanyProps) {
    this._id = id;
    this._legalName = props.legalName;
    this._tradeName = props.tradeName;
    this._cnpj = props.cnpj;
    this._website = props.website;
    this._address = props.address;
    this._segment = props.segment;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: CompanyProps): Company {
    return new Company(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get legalName(): string {
    return this._legalName;
  }

  public get tradeName(): string {
    return this._tradeName;
  }

  public get cnpj(): CNPJ {
    return this._cnpj;
  }

  public get website(): Website {
    return this._website;
  }

  public get address(): Address {
    return this._address;
  }

  public get segment(): string {
    return this._segment;
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

  public equals(other: Company): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      legalName: this._legalName,
      tradeName: this._tradeName,
      cnpj: this._cnpj,
      website: this._website,
      address: this._address,
      segment: this._segment,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
