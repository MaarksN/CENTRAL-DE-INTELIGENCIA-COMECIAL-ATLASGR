/**
 * @file ValueObject.ts
 * @description Base class for Domain Value Objects, enforcing immutability
 * and structural (deep) equality comparison.
 */

/**
 * Abstract base class representing a Domain Value Object.
 *
 * A Value Object has no conceptual identity; it is defined entirely by the
 * combination of its properties. Instances are immutable - `props` is frozen
 * on construction - and equality is evaluated structurally.
 *
 * @typeParam TProps - Shape of the properties encapsulated by the value object.
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Performs a deep structural equality check between two arbitrary values.
   */
  private static deepEquals(left: unknown, right: unknown): boolean {
    if (left === right) {
      return true;
    }

    if (
      left === null ||
      right === null ||
      typeof left !== 'object' ||
      typeof right !== 'object'
    ) {
      return false;
    }

    if (left instanceof Date && right instanceof Date) {
      return left.getTime() === right.getTime();
    }

    if (Array.isArray(left) || Array.isArray(right)) {
      if (!Array.isArray(left) || !Array.isArray(right)) {
        return false;
      }

      if (left.length !== right.length) {
        return false;
      }

      return left.every((item, index) => ValueObject.deepEquals(item, right[index]));
    }

    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftRecord);
    const rightKeys = Object.keys(rightRecord);

    if (leftKeys.length !== rightKeys.length) {
      return false;
    }

    return leftKeys.every((key) =>
      ValueObject.deepEquals(leftRecord[key], rightRecord[key]),
    );
  }

  /**
   * Compares this Value Object with another for structural (deep) equality.
   */
  public equals(valueObject?: ValueObject<TProps>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }

    if (!(valueObject instanceof ValueObject)) {
      return false;
    }

    return ValueObject.deepEquals(this.props, valueObject.props);
  }
}

