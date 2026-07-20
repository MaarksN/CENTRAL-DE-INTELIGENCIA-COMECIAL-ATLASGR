/**
 * @file ContactCreatedEvent.ts
 * @description Evento de dominio disparado quando ocorre ContactCreated.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface ContactCreatedEventPayload {
  readonly contactId: string;
  readonly companyId: string;
}

export class ContactCreatedEvent implements DomainEvent {
  public readonly eventName: string = 'ContactCreatedEvent';
  public readonly occurredAt: Date;
  public readonly payload: ContactCreatedEventPayload;

  private constructor(payload: ContactCreatedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: ContactCreatedEventPayload): ContactCreatedEvent {
    return new ContactCreatedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
