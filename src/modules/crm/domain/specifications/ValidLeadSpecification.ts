/**
 * @file ValidLeadSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Lead.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead } from '../entities/Lead';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class ValidLeadSpecification implements ISpecification<Lead> {
  public isSatisfiedBy(candidate: Lead): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Lead): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Lead>): ISpecification<Lead> {
    const self: ValidLeadSpecification = this;
    return {
      isSatisfiedBy(candidate: Lead): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
