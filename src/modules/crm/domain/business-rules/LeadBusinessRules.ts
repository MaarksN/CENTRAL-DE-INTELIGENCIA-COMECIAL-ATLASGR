/**
 * @file LeadBusinessRules.ts
 * @description Conjunto de regras de negocio invariantes para Lead.
 * @module CRM/BusinessRules
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class LeadBusinessRules {
  public static readonly MAX_ACTIVE_ITEMS: number = 1000;

  public static validate(value: unknown): boolean {
    if (value === null || value === undefined) {
      throw new Error('LeadBusinessRules: value cannot be null or undefined');
    }
    return true;
  }

  public static isWithinLimit(count: number): boolean {
    return count <= LeadBusinessRules.MAX_ACTIVE_ITEMS;
  }
}
