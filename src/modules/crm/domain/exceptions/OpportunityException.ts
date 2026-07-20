/**
 * @file OpportunityException.ts
 * @description Excecao de dominio lancada em cenarios invalidos de Opportunity.
 * @module CRM/Exceptions
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class OpportunityException extends Error {
  public readonly code: string;

  public constructor(message: string) {
    super(message);
    this.name = 'OpportunityException';
    this.code = 'OPPORTUNITYEXCEPTION';
    Object.setPrototypeOf(this, OpportunityException.prototype);
  }
}
