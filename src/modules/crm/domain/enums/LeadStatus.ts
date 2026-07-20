/**
 * @file LeadStatus.ts
 * @description Enum LeadStatus utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  WON = 'WON',
  LOST = 'LOST',
}

export function isLeadStatus(value: string): value is LeadStatus {
  return Object.values(LeadStatus).includes(value as LeadStatus);
}
