/**
 * @file ProposalCalculationService.ts
 * @description Servico de dominio responsavel pela logica de ProposalCalculation.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Proposal } from '../entities/Proposal';

export interface IProposalCalculationService {
  execute(input: Proposal): Promise<Proposal>;
}

export class ProposalCalculationService implements IProposalCalculationService {
  public async execute(input: Proposal): Promise<Proposal> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Proposal): void {
    if (input === null || input === undefined) {
      throw new Error('ProposalCalculationService: input is required');
    }
  }

  private process(input: Proposal): Proposal {
    return input;
  }
}
