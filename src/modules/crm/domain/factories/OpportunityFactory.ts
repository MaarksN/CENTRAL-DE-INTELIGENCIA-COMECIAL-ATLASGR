/**
 * @file OpportunityFactory.ts
 * @description Factory responsavel pela criacao consistente de instancias de Opportunity.
 * @module CRM/Factories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity, OpportunityProps } from '../entities/Opportunity';

export class OpportunityFactory {
  public static build(id: string, props: OpportunityProps): Opportunity {
    return Opportunity.create(id, props);
  }
}
