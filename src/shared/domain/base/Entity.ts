/**
 * @file Entity.ts
 * @description Base class for all Domain Entities, providing identity comparison,
 * encapsulated typed properties and inheritance support for Clean/Hexagonal Architecture.
 */

import { UniqueEntityID } from './UniqueEntityID.js';

/**
 * Base contract for any object that can be uniquely identified by an `UniqueEntityID`.
 */
export interface EntityIdentifiable {
  readonly id: UniqueEntityID;
}

/**
 * Abstract base class representing a Domain Entity.
 *
 * An Entity is defined by its identity (`UniqueEntityID`), not by its attributes.
 * Two entities with the same id are considered equal regardless of their props.
 *
 * @typeParam TProps - Shape of the properties encapsulated by the entity.
 */
export abstract class Entity<TProps> implements EntityIdentifiable {
  protected readonly _id: UniqueEntityID;
  protected readonly props: TProps;

  protected constructor(props: TProps, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  /**
   * Unique identifier of this entity.
   */
  public get id(): UniqueEntityID {
    return this._id;
  }

  /**
   * Determines whether the provided candidate is an `Entity` instance.
   */
  private static isEntity(candidate: unknown): candidate is Entity<unknown> {
    return candidate instanceof Entity;
  }

  /**
   * Compares this entity with another for identity equality.
   *
   * Entities are equal when they reference the same object OR
   * share the same `UniqueEntityID`.
   */
  public equals(entity?: Entity<TProps>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!Entity.isEntity(entity)) {
      return false;
    }

    return this._id.equals(entity._id);
  }
}

