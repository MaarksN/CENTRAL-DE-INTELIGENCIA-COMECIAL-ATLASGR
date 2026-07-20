/**
 * @file LeadQualifiedEvent.ts
 * @description Evento de dominio disparado quando ocorre LeadQualified.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface LeadQualifiedEventPayload {
  readonly leadId: string;
  readonly qualifiedBy: string;
}

export class LeadQualifiedEvent implements DomainEvent {
  public readonly eventName: string = 'LeadQualifiedEvent';
  public readonly occurredAt: Date;
  public readonly payload: LeadQualifiedEventPayload;

  private constructor(payload: LeadQualifiedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: LeadQualifiedEventPayload): LeadQualifiedEvent {
    return new LeadQualifiedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
