/**
 * @file ContactFactory.ts
 * @description Factory responsavel pela criacao consistente de instancias de Contact.
 * @module CRM/Factories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Contact, ContactProps } from '../entities/Contact';

export class ContactFactory {
  public static build(id: string, props: ContactProps): Contact {
    return Contact.create(id, props);
  }
}
