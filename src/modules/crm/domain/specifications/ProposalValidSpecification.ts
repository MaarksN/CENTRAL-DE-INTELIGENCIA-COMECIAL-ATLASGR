/**
 * @file ProposalValidSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Proposal.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Proposal } from '../entities/Proposal';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class ProposalValidSpecification implements ISpecification<Proposal> {
  public isSatisfiedBy(candidate: Proposal): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Proposal): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Proposal>): ISpecification<Proposal> {
    const self: ProposalValidSpecification = this;
    return {
      isSatisfiedBy(candidate: Proposal): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
