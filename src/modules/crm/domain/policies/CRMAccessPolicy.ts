/**
 * @file CRMAccessPolicy.ts
 * @description Politica de permissao de acesso relacionada a CRM.
 * @module CRM/Policies
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export type CRMAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ASSIGN';

export interface CRMActor {
  readonly userId: string;
  readonly role: string;
}

export class CRMAccessPolicy {
  private static readonly ALLOWED_ROLES: readonly string[] = ['ADMIN', 'MANAGER', 'SALES_REP'];

  public canPerform(actor: CRMActor, action: CRMAction): boolean {
    if (!CRMAccessPolicy.ALLOWED_ROLES.includes(actor.role)) {
      return false;
    }
    if (action === 'DELETE' && actor.role !== 'ADMIN') {
      return false;
    }
    return true;
  }
}
