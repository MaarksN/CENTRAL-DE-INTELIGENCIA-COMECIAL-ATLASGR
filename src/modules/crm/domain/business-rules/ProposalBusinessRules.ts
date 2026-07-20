/**
 * @file ProposalBusinessRules.ts
 * @description Conjunto de regras de negocio invariantes para Proposal.
 * @module CRM/BusinessRules
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class ProposalBusinessRules {
  public static readonly MAX_ACTIVE_ITEMS: number = 1000;

  public static validate(value: unknown): boolean {
    if (value === null || value === undefined) {
      throw new Error('ProposalBusinessRules: value cannot be null or undefined');
    }
    return true;
  }

  public static isWithinLimit(count: number): boolean {
    return count <= ProposalBusinessRules.MAX_ACTIVE_ITEMS;
  }
}
