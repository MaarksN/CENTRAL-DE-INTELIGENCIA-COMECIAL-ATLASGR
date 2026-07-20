/**
 * @file LeadSource.ts
 * @description Enum LeadSource utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  COLD_CALL = 'COLD_CALL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EVENT = 'EVENT',
  ADVERTISEMENT = 'ADVERTISEMENT',
}

export function isLeadSource(value: string): value is LeadSource {
  return Object.values(LeadSource).includes(value as LeadSource);
}
