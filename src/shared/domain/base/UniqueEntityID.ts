/**
 * @file UniqueEntityID.ts
 * @description Value type representing a globally unique identifier for
 * Entities and Aggregate Roots, backed by RFC 4122 UUIDs.
 */

import { randomUUID } from 'node:crypto';

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Represents a globally unique identifier for a Domain Entity.
 *
 * Wraps a UUID v4 string, providing automatic generation, validation,
 * serialization and equality comparison.
 */
export class UniqueEntityID {
  private readonly value: string;

  public constructor(id?: string) {
    if (id !== undefined) {
      if (!UniqueEntityID.isValid(id)) {
        throw new Error(`UniqueEntityID: invalid identifier "${id}".`);
      }

      this.value = id;
      return;
    }

    this.value = randomUUID();
  }

  /**
   * Validates whether the provided string is a well-formed UUID v4.
   */
  public static isValid(id: string): boolean {
    return UUID_V4_PATTERN.test(id);
  }

  /**
   * Creates a `UniqueEntityID` from a raw string, validating its format.
   */
  public static create(id?: string): UniqueEntityID {
    return new UniqueEntityID(id);
  }

  /**
   * Returns the raw string representation of the identifier.
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Returns the primitive value of the identifier.
   */
  public toValue(): string {
    return this.value;
  }

  /**
   * Serializes the identifier to JSON as its raw string value.
   */
  public toJSON(): string {
    return this.value;
  }

  /**
   * Compares this identifier with another for equality.
   */
  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof UniqueEntityID)) {
      return false;
    }

    return this.value === id.value;
  }
}

