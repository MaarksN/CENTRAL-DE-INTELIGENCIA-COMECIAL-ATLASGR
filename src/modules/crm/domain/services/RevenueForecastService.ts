/**
 * @file RevenueForecastService.ts
 * @description Servico de dominio responsavel pela logica de RevenueForecast.
 * @module CRM/Services
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Opportunity } from '../entities/Opportunity';

export interface IRevenueForecastService {
  execute(input: Opportunity): Promise<Opportunity>;
}

export class RevenueForecastService implements IRevenueForecastService {
  public async execute(input: Opportunity): Promise<Opportunity> {
    this.validate(input);
    return this.process(input);
  }

  private validate(input: Opportunity): void {
    if (input === null || input === undefined) {
      throw new Error('RevenueForecastService: input is required');
    }
  }

  private process(input: Opportunity): Opportunity {
    return input;
  }
}
