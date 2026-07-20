/**
 * @file AggregateRoot.ts
 * @description Base class for Domain Aggregates, extending Entity with
 * Domain Event registration, retrieval and lifecycle management.
 */

import { Entity } from './Entity.js';
import { UniqueEntityID } from './UniqueEntityID.js';
import type { IDomainEvent } from './IDomainEvent.js';

/**
 * Abstract base class representing an Aggregate Root.
 *
 * An Aggregate Root is the single entry point for consistency within an
 * Aggregate boundary. It extends `Entity` and is additionally responsible
 * for collecting Domain Events raised during state transitions, so that
 * they can be dispatched by the Application layer after persistence.
 *
 * @typeParam TProps - Shape of the properties encapsulated by the aggregate.
 */
export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private readonly _domainEvents: IDomainEvent[] = [];

  protected constructor(props: TProps, id?: UniqueEntityID) {
    super(props, id);
  }

  /**
   * Read-only view of the Domain Events raised by this aggregate since
   * the last time they were cleared.
   */
  public get domainEvents(): ReadonlyArray<IDomainEvent> {
    return [...this._domainEvents];
  }

  /**
   * Registers a new Domain Event raised by this aggregate.
   */
  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Removes a specific Domain Event from the aggregate, identified by its `eventId`.
   */
  public removeDomainEvent(eventId: string): void {
    const index = this._domainEvents.findIndex(
      (domainEvent) => domainEvent.eventId === eventId,
    );

    if (index >= 0) {
      this._domainEvents.splice(index, 1);
    }
  }

  /**
   * Clears every Domain Event currently registered on this aggregate.
   *
   * Should be invoked by the Application layer right after the events
   * have been successfully published/dispatched.
   */
  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  /**
   * Returns and clears all pending Domain Events in a single atomic operation.
   */
  public pullDomainEvents(): ReadonlyArray<IDomainEvent> {
    const events = [...this._domainEvents];
    this.clearEvents();
    return events;
  }
}

