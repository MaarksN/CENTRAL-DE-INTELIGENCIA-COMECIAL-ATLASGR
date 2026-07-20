/**
 * @file Address.ts
 * @description Value Object Address imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface AddressProps {
  readonly street: string;
  readonly number: string;
  readonly complement: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export class Address {
  private readonly _props: AddressProps;

  private constructor(props: AddressProps) {
    this._props = props;
  }

  public static create(props: AddressProps): Address {
    if (props.zipCode.trim().length === 0) {
      throw new Error('Address zipCode is required');
    }
    return new Address(props);
  }

  public get street(): string {
    return this._props.street;
  }

  public get city(): string {
    return this._props.city;
  }

  public get state(): string {
    return this._props.state;
  }

  public get zipCode(): string {
    return this._props.zipCode;
  }

  public get country(): string {
    return this._props.country;
  }

  public toFullAddress(): string {
    return `${this._props.street}, ${this._props.number} - ${this._props.city}/${this._props.state} - ${this._props.zipCode}`;
  }

  public equals(other: Address): boolean {
    return this.toFullAddress() === other.toFullAddress();
  }
}
