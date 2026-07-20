/**
 * @file TaskCompletedEvent.ts
 * @description Evento de dominio disparado quando ocorre TaskCompleted.
 * @module CRM/Events
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface TaskCompletedEventPayload {
  readonly taskId: string;
  readonly completedBy: string;
}

export class TaskCompletedEvent implements DomainEvent {
  public readonly eventName: string = 'TaskCompletedEvent';
  public readonly occurredAt: Date;
  public readonly payload: TaskCompletedEventPayload;

  private constructor(payload: TaskCompletedEventPayload, occurredAt: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt;
  }

  public static create(payload: TaskCompletedEventPayload): TaskCompletedEvent {
    return new TaskCompletedEvent(payload, new Date());
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      payload: this.payload,
    };
  }
}
