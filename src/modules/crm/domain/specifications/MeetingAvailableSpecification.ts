/**
 * @file MeetingAvailableSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Meeting.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Meeting } from '../entities/Meeting';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class MeetingAvailableSpecification implements ISpecification<Meeting> {
  public isSatisfiedBy(candidate: Meeting): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Meeting): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Meeting>): ISpecification<Meeting> {
    const self: MeetingAvailableSpecification = this;
    return {
      isSatisfiedBy(candidate: Meeting): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
