/**
 * @file OpportunityOpenSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Opportunity.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity } from '../entities/Opportunity';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class OpportunityOpenSpecification implements ISpecification<Opportunity> {
  public isSatisfiedBy(candidate: Opportunity): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Opportunity): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Opportunity>): ISpecification<Opportunity> {
    const self: OpportunityOpenSpecification = this;
    return {
      isSatisfiedBy(candidate: Opportunity): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
