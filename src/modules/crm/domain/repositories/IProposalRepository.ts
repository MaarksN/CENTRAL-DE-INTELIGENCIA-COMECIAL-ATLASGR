/**
 * @file IProposalRepository.ts
 * @description Contrato de repositorio para persistencia de Proposal.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Proposal } from '../entities/Proposal';

export interface IProposalRepository {
  findById(id: string): Promise<Proposal | null>;
  findAll(): Promise<Proposal[]>;
  save(entity: Proposal): Promise<void>;
  update(entity: Proposal): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
