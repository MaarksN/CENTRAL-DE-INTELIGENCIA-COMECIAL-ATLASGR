/**
 * @file CompanyCanReceiveLeadSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Company.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Company } from '../entities/Company';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class CompanyCanReceiveLeadSpecification implements ISpecification<Company> {
  public isSatisfiedBy(candidate: Company): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Company): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Company>): ISpecification<Company> {
    const self: CompanyCanReceiveLeadSpecification = this;
    return {
      isSatisfiedBy(candidate: Company): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
