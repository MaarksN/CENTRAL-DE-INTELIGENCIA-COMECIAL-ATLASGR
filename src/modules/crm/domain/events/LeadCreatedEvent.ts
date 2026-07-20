/**
 * @file LeadCreatedEvent.ts
 * @description Evento de dominio disparado quando ocorre LeadCreated.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface LeadCreatedEventPayload {
  readonly leadId: string;
  readonly name: string;
  readonly source: string;
}

export class LeadCreatedEvent implements DomainEvent {
  public readonly eventName: string = 'LeadCreatedEvent';
  public readonly occurredAt: Date;
  public readonly payload: LeadCreatedEventPayload;

  private constructor(payload: LeadCreatedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: LeadCreatedEventPayload): LeadCreatedEvent {
    return new LeadCreatedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
