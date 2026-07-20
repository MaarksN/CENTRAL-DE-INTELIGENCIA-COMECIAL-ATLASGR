/**
 * @file ProposalSentEvent.ts
 * @description Evento de dominio disparado quando ocorre ProposalSent.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface ProposalSentEventPayload {
  readonly proposalId: string;
  readonly sentTo: string;
}

export class ProposalSentEvent implements DomainEvent {
  public readonly eventName: string = 'ProposalSentEvent';
  public readonly occurredAt: Date;
  public readonly payload: ProposalSentEventPayload;

  private constructor(payload: ProposalSentEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: ProposalSentEventPayload): ProposalSentEvent {
    return new ProposalSentEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
