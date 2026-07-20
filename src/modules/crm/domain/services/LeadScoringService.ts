/**
 * @file LeadScoringService.ts
 * @description Servico de dominio responsavel pela logica de LeadScoring.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead } from '../entities/Lead';

export interface ILeadScoringService {
  execute(input: Lead): Promise<Lead>;
}

export class LeadScoringService implements ILeadScoringService {
  public async execute(input: Lead): Promise<Lead> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Lead): void {
    if (input === null || input === undefined) {
      throw new Error('LeadScoringService: input is required');
    }
  }

  private process(input: Lead): Lead {
    return input;
  }
}
