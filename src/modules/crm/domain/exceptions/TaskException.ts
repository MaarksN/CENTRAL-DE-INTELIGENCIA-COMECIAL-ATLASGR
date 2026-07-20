/**
 * @file TaskException.ts
 * @description Excecao de dominio lancada em cenarios invalidos de Task.
 * @module CRM/Exceptions
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class TaskException extends Error {
  public readonly code: string;

  public constructor(message: string) {
    super(message);
    this.name = 'TaskException';
    this.code = 'TASKEXCEPTION';
    Object.setPrototypeOf(this, TaskException.prototype);
  }
}
