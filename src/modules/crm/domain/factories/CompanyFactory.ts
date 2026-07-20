/**
 * @file CompanyFactory.ts
 * @description Factory responsavel pela criacao consistente de instancias de Company.
 * @module CRM/Factories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Company, CompanyProps } from '../entities/Company';

export class CompanyFactory {
  public static build(id: string, props: CompanyProps): Company {
    return Company.create(id, props);
  }
}
