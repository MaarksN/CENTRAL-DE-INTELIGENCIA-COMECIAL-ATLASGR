/**
 * @file CompanyCreatedEvent.ts
 * @description Evento de dominio disparado quando ocorre CompanyCreated.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface CompanyCreatedEventPayload {
  readonly companyId: string;
  readonly legalName: string;
}

export class CompanyCreatedEvent implements DomainEvent {
  public readonly eventName: string = 'CompanyCreatedEvent';
  public readonly occurredAt: Date;
  public readonly payload: CompanyCreatedEventPayload;

  private constructor(payload: CompanyCreatedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: CompanyCreatedEventPayload): CompanyCreatedEvent {
    return new CompanyCreatedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
