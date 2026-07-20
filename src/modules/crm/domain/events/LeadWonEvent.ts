/**
 * @file LeadWonEvent.ts
 * @description Evento de dominio disparado quando ocorre LeadWon.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface LeadWonEventPayload {
  readonly leadId: string;
  readonly amount: number;
}

export class LeadWonEvent implements DomainEvent {
  public readonly eventName: string = 'LeadWonEvent';
  public readonly occurredAt: Date;
  public readonly payload: LeadWonEventPayload;

  private constructor(payload: LeadWonEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: LeadWonEventPayload): LeadWonEvent {
    return new LeadWonEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
