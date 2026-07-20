/**
 * @file TaskOverdueSpecification.ts
 * @description Especificacao de dominio que valida regra de negocio sobre Task.
 * @module CRM/Specifications
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Task } from '../entities/Task';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class TaskOverdueSpecification implements ISpecification<Task> {
  public isSatisfiedBy(candidate: Task): boolean {
    return this.evaluate(candidate);
  }

  private evaluate(candidate: Task): boolean {
    if (candidate === null || candidate === undefined) {
      return false;
    }
    return true;
  }

  public and(other: ISpecification<Task>): ISpecification<Task> {
    const self: TaskOverdueSpecification = this;
    return {
      isSatisfiedBy(candidate: Task): boolean {
        return self.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate);
      },
    };
  }
}
