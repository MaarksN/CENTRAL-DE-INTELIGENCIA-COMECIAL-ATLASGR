/**
 * @file DealClosedEvent.ts
 * @description Evento de dominio disparado quando ocorre DealClosed.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface DealClosedEventPayload {
  readonly dealId: string;
  readonly status: string;
}

export class DealClosedEvent implements DomainEvent {
  public readonly eventName: string = 'DealClosedEvent';
  public readonly occurredAt: Date;
  public readonly payload: DealClosedEventPayload;

  private constructor(payload: DealClosedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: DealClosedEventPayload): DealClosedEvent {
    return new DealClosedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
