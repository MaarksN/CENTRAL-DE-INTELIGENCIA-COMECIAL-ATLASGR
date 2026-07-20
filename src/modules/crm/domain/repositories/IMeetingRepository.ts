/**
 * @file IMeetingRepository.ts
 * @description Contrato de repositorio para persistencia de Meeting.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Meeting } from '../entities/Meeting';

export interface IMeetingRepository {
  findById(id: string): Promise<Meeting | null>;
  findAll(): Promise<Meeting[]>;
  save(entity: Meeting): Promise<void>;
  update(entity: Meeting): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
