/**
 * @file MeetingScheduledEvent.ts
 * @description Evento de dominio disparado quando ocorre MeetingScheduled.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface MeetingScheduledEventPayload {
  readonly meetingId: string;
  readonly startTime: string;
}

export class MeetingScheduledEvent implements DomainEvent {
  public readonly eventName: string = 'MeetingScheduledEvent';
  public readonly occurredAt: Date;
  public readonly payload: MeetingScheduledEventPayload;

  private constructor(payload: MeetingScheduledEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: MeetingScheduledEventPayload): MeetingScheduledEvent {
    return new MeetingScheduledEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
