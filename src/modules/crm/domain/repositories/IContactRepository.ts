/**
 * @file IContactRepository.ts
 * @description Contrato de repositorio para persistencia de Contact.
 * @module CRM/Repositories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Contact } from '../entities/Contact';

export interface IContactRepository {
  findById(id: string): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;
  save(entity: Contact): Promise<void>;
  update(entity: Contact): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
