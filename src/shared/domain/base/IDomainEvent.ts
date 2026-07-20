/**
 * @file IDomainEvent.ts
 * @description Contract implemented by every Domain Event raised within
 * an Aggregate boundary.
 */

/**
 * Represents a fact that occurred within the Domain and is relevant to
 * other parts of the system (Application layer, other Aggregates,
 * integration events, etc.).
 *
 * @typeParam TPayload - Shape of the data carried by the event.
 */
export interface IDomainEvent<TPayload = Record<string, unknown>> {
  /**
   * Unique identifier of this specific event occurrence.
   */
  readonly eventId: string;

  /**
   * Identifier of the Aggregate that raised the event.
   */
  readonly aggregateId: string;

  /**
   * UTC timestamp at which the event occurred.
   */
  readonly occurredOn: Date;

  /**
   * Unique name identifying the event type.
   */
  readonly eventName: string;

  /**
   * Data payload describing the event.
   */
  readonly payload: TPayload;
}

