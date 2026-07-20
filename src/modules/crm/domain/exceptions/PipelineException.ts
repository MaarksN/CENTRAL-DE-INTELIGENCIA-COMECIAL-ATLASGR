/**
 * @file PipelineException.ts
 * @description Excecao de dominio lancada em cenarios invalidos de Pipeline.
 * @module CRM/Exceptions
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class PipelineException extends Error {
  public readonly code: string;

  public constructor(message: string) {
    super(message);
    this.name = 'PipelineException';
    this.code = 'PIPELINEEXCEPTION';
    Object.setPrototypeOf(this, PipelineException.prototype);
  }
}
