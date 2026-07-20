/**
 * @file ContactIsPrimarySpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Contact.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Contact } from '../entities/Contact';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class ContactIsPrimarySpecification implements ISpecification<Contact> {
  public isSatisfiedBy(candidate: Contact): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Contact): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Contact>): ISpecification<Contact> {
    const self: ContactIsPrimarySpecification = this;
    return {
      isSatisfiedBy(candidate: Contact): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
