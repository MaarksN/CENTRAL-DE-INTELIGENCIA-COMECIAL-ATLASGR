/**
 * @file PipelineMovementService.ts
 * @description Servico de dominio responsavel pela logica de PipelineMovement.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity } from '../entities/Opportunity';

export interface IPipelineMovementService {
  execute(input: Opportunity): Promise<Opportunity>;
}

export class PipelineMovementService implements IPipelineMovementService {
  public async execute(input: Opportunity): Promise<Opportunity> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Opportunity): void {
    if (input === null || input === undefined) {
      throw new Error('PipelineMovementService: input is required');
    }
  }

  private process(input: Opportunity): Opportunity {
    return input;
  }
}
