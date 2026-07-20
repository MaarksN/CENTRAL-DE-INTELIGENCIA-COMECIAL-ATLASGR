/**
 * @file LeadAlreadyExistsException.ts
 * @description Excecao de dominio lancada em cenarios invalidos de Lead.
 * @module CRM/Exceptions
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class LeadAlreadyExistsException extends Error {
  public readonly code: string;

  public constructor(message: string) {
    super(message);
    this.name = 'LeadAlreadyExistsException';
    this.code = 'LEADALREADYEXISTSEXCEPTION';
    Object.setPrototypeOf(this, LeadAlreadyExistsException.prototype);
  }
}
