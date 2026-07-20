/**
 * @file IOpportunityRepository.ts
 * @description Contrato de repositorio para persistencia de Opportunity.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity } from '../entities/Opportunity';

export interface IOpportunityRepository {
  findById(id: string): Promise<Opportunity | null>;
  findAll(): Promise<Opportunity[]>;
  save(entity: Opportunity): Promise<void>;
  update(entity: Opportunity): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
