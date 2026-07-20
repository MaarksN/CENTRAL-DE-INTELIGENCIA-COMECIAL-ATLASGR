/**
 * @file ITaskRepository.ts
 * @description Contrato de repositorio para persistencia de Task.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Task } from '../entities/Task';

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  save(entity: Task): Promise<void>;
  update(entity: Task): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
