/**
 * @file OpportunityCreatedEvent.ts
 * @description Evento de dominio disparado quando ocorre OpportunityCreated.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface OpportunityCreatedEventPayload {
  readonly opportunityId: string;
  readonly amount: number;
}

export class OpportunityCreatedEvent implements DomainEvent {
  public readonly eventName: string = 'OpportunityCreatedEvent';
  public readonly occurredAt: Date;
  public readonly payload: OpportunityCreatedEventPayload;

  private constructor(payload: OpportunityCreatedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: OpportunityCreatedEventPayload): OpportunityCreatedEvent {
    return new OpportunityCreatedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
