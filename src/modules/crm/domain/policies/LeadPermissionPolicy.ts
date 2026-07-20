/**
 * @file LeadPermissionPolicy.ts
 * @description Politica de permissao de acesso relacionada a Lead.
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

export class LeadPermissionPolicy {
  private static readonly ALLOWED_ROLES: readonly string[] = ['ADMIN', 'MANAGER', 'SALES_REP'];

  public canPerform(actor: CRMActor, action: CRMAction): boolean {
    if (!LeadPermissionPolicy.ALLOWED_ROLES.includes(actor.role)) {
      return false;
    }
    if (action === 'DELETE' && actor.role !== 'ADMIN') {
      return false;
    }
    return true;
  }
}
