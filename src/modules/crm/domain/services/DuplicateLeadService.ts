/**
 * @file DuplicateLeadService.ts
 * @description Servico de dominio responsavel pela logica de DuplicateLead.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead } from '../entities/Lead';

export interface IDuplicateLeadService {
  execute(input: Lead): Promise<Lead>;
}

export class DuplicateLeadService implements IDuplicateLeadService {
  public async execute(input: Lead): Promise<Lead> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Lead): void {
    if (input === null || input === undefined) {
      throw new Error('DuplicateLeadService: input is required');
    }
  }

  private process(input: Lead): Lead {
    return input;
  }
}
