/**
 * @file DealCloseSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Deal.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Deal } from '../entities/Deal';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class DealCloseSpecification implements ISpecification<Deal> {
  public isSatisfiedBy(candidate: Deal): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Deal): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Deal>): ISpecification<Deal> {
    const self: DealCloseSpecification = this;
    return {
      isSatisfiedBy(candidate: Deal): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
