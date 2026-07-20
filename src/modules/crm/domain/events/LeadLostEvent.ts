/**
 * @file LeadLostEvent.ts
 * @description Evento de dominio disparado quando ocorre LeadLost.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface LeadLostEventPayload {
  readonly leadId: string;
  readonly reason: string;
}

export class LeadLostEvent implements DomainEvent {
  public readonly eventName: string = 'LeadLostEvent';
  public readonly occurredAt: Date;
  public readonly payload: LeadLostEventPayload;

  private constructor(payload: LeadLostEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: LeadLostEventPayload): LeadLostEvent {
    return new LeadLostEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
