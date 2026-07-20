/**
 * @file ICompanyRepository.ts
 * @description Contrato de repositorio para persistencia de Company.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Company } from '../entities/Company';

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  save(entity: Company): Promise<void>;
  update(entity: Company): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
