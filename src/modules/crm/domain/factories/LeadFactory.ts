/**
 * @file LeadFactory.ts
 * @description Factory responsavel pela criacao consistente de instancias de Lead.
 * @module CRM/Factories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead, LeadProps } from '../entities/Lead';

export class LeadFactory {
  public static build(id: string, props: LeadProps): Lead {
    return Lead.create(id, props);
  }
}
