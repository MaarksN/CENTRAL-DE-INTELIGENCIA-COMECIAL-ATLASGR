/**
 * @file PipelineType.ts
 * @description Enum PipelineType utilizado no contexto CRM.
 * @module CRM/Enums
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export enum PipelineType {
  SALES = 'SALES',
  SUPPORT = 'SUPPORT',
  ONBOARDING = 'ONBOARDING',
  RENEWAL = 'RENEWAL',
}

export function isPipelineType(value: string): value is PipelineType {
  return Object.values(PipelineType).includes(value as PipelineType);
}
