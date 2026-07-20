/**
 * @file GeoLocation.ts
 * @description Value Object GeoLocation imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class GeoLocation {
  private readonly _latitude: number;
  private readonly _longitude: number;

  private constructor(latitude: number, longitude: number) {
    this._latitude = latitude;
    this._longitude = longitude;
  }

  public static create(latitude: number, longitude: number): GeoLocation {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude value');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude value');
    }
    return new GeoLocation(latitude, longitude);
  }

  public get latitude(): number {
    return this._latitude;
  }

  public get longitude(): number {
    return this._longitude;
  }

  public equals(other: GeoLocation): boolean {
    return this._latitude === other.latitude && this._longitude === other.longitude;
  }

  public toString(): string {
    return `${this._latitude},${this._longitude}`;
  }
}
