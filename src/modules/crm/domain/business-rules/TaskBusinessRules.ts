/**
 * @file TaskBusinessRules.ts
 * @description Conjunto de regras de negocio invariantes para Task.
 * @module CRM/BusinessRules
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class TaskBusinessRules {
  public static readonly MAX_ACTIVE_ITEMS: number = 1000;

  public static validate(value: unknown): boolean {
    if (value === null || value === undefined) {
      throw new Error('TaskBusinessRules: value cannot be null or undefined');
    }
    return true;
  }

  public static isWithinLimit(count: number): boolean {
    return count <= TaskBusinessRules.MAX_ACTIVE_ITEMS;
  }
}
