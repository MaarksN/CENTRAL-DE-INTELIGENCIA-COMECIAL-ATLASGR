/**
 * @file ActivityStatus.ts
 * @description Enum ActivityStatus utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum ActivityStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export function isActivityStatus(value: string): value is ActivityStatus {
  return Object.values(ActivityStatus).includes(value as ActivityStatus);
}
