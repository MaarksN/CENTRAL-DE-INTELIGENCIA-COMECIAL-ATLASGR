/**
 * @file ILeadRepository.ts
 * @description Contrato de repositorio para persistencia de Lead.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead } from '../entities/Lead';

export interface ILeadRepository {
  findById(id: string): Promise<Lead | null>;
  findAll(): Promise<Lead[]>;
  save(entity: Lead): Promise<void>;
  update(entity: Lead): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
