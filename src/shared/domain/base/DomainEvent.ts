/**
 * @file DomainEvent.ts
 * @description Abstract base class implemented by concrete Domain Events.
 */

import { randomUUID } from 'node:crypto';
import type { IDomainEvent } from './IDomainEvent.js';

/**
 * Base class for concrete Domain Events.
 *
 * Concrete subclasses must define `eventName` and provide the `payload`
 * describing the event, while `eventId` and `occurredOn` are generated
 * automatically upon construction.
 *
 * @typeParam TPayload - Shape of the data carried by the event.
 */
export abstract class DomainEvent<TPayload = Record<string, unknown>>
  implements IDomainEvent<TPayload>
{
  public readonly eventId: string;
  public readonly aggregateId: string;
  public readonly occurredOn: Date;
  public readonly payload: TPayload;

  /**
   * Unique name identifying the event type. Must be implemented by subclasses.
   */
  public abstract readonly eventName: string;

  protected constructor(aggregateId: string, payload: TPayload) {
    this.eventId = randomUUID();
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}

