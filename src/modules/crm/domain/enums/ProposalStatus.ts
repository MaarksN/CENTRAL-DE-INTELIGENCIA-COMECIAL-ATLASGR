/**
 * @file ProposalStatus.ts
 * @description Enum ProposalStatus utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export function isProposalStatus(value: string): value is ProposalStatus {
  return Object.values(ProposalStatus).includes(value as ProposalStatus);
}
