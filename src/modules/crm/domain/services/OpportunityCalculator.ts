/**
 * @file OpportunityCalculator.ts
 * @description Servico de dominio responsavel pela logica de OpportunityCalculator.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity } from '../entities/Opportunity';

export interface IOpportunityCalculator {
  execute(input: Opportunity): Promise<Opportunity>;
}

export class OpportunityCalculator implements IOpportunityCalculator {
  public async execute(input: Opportunity): Promise<Opportunity> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Opportunity): void {
    if (input === null || input === undefined) {
      throw new Error('OpportunityCalculator: input is required');
    }
  }

  private process(input: Opportunity): Opportunity {
    return input;
  }
}
