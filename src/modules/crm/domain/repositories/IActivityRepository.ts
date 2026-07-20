/**
 * @file IActivityRepository.ts
 * @description Contrato de repositorio para persistencia de Activity.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Activity } from '../entities/Activity';

export interface IActivityRepository {
  findById(id: string): Promise<Activity | null>;
  findAll(): Promise<Activity[]>;
  save(entity: Activity): Promise<void>;
  update(entity: Activity): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
