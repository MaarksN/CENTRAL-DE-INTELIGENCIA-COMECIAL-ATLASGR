/**
 * @file Product.ts
 * @description Entidade de dominio Product do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Money } from '../value-objects/Money';

export interface ProductProps {
  readonly name: string;
  readonly price: Money;
  readonly sku: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Product {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _price: Money;
  private readonly _sku: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: ProductProps) {
    this._id = id;
    this._name = props.name;
    this._price = props.price;
    this._sku = props.sku;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: ProductProps): Product {
    return new Product(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get price(): Money {
    return this._price;
  }

  public get sku(): string {
    return this._sku;
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

  public equals(other: Product): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      price: this._price,
      sku: this._sku,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
