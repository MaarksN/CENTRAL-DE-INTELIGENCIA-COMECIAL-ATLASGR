/**
 * @file PipelineBusinessRules.ts
 * @description Conjunto de regras de negocio invariantes para Pipeline.
 * @module CRM/BusinessRules
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class PipelineBusinessRules {
  public static readonly MAX_ACTIVE_ITEMS: number = 1000;

  public static validate(value: unknown): boolean {
    if (value === null || value === undefined) {
      throw new Error('PipelineBusinessRules: value cannot be null or undefined');
    }
    return true;
  }

  public static isWithinLimit(count: number): boolean {
    return count <= PipelineBusinessRules.MAX_ACTIVE_ITEMS;
  }
}
