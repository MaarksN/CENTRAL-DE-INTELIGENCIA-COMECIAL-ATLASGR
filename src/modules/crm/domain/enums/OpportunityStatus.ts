/**
 * @file OpportunityStatus.ts
 * @description Enum OpportunityStatus utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum OpportunityStatus {
  OPEN = 'OPEN',
  WON = 'WON',
  LOST = 'LOST',
  ABANDONED = 'ABANDONED',
}

export function isOpportunityStatus(value: string): value is OpportunityStatus {
  return Object.values(OpportunityStatus).includes(value as OpportunityStatus);
}
