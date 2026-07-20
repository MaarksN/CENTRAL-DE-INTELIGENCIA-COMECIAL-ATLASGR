/**
 * @file ProposalException.ts
 * @description Excecao de dominio lancada em cenarios invalidos de Proposal.
 * @module CRM/Exceptions
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class ProposalException extends Error {
  public readonly code: string;

  public constructor(message: string) {
    super(message);
    this.name = 'ProposalException';
    this.code = 'PROPOSALEXCEPTION';
    Object.setPrototypeOf(this, ProposalException.prototype);
  }
}
