/**
 * @file DealStatus.ts
 * @description Enum DealStatus utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum DealStatus {
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export function isDealStatus(value: string): value is DealStatus {
  return Object.values(DealStatus).includes(value as DealStatus);
}
