/**
 * @file TerritoryAssignmentService.ts
 * @description Servico de dominio responsavel pela logica de TerritoryAssignment.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Lead } from '../entities/Lead';

export interface ITerritoryAssignmentService {
  execute(input: Lead): Promise<Lead>;
}

export class TerritoryAssignmentService implements ITerritoryAssignmentService {
  public async execute(input: Lead): Promise<Lead> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Lead): void {
    if (input === null || input === undefined) {
      throw new Error('TerritoryAssignmentService: input is required');
    }
  }

  private process(input: Lead): Lead {
    return input;
  }
}
