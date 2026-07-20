/**
 * @file EntityProps.ts
 * @description Reusable base type for Entity properties, exposing common
 * auditing and versioning fields without forcing their usage.
 */

/**
 * Base type offering optional auditing and versioning fields that can be
 * composed into concrete Entity `props` types.
 *
 * Usage of any of these fields is entirely optional per Entity.
 */
export type BaseEntityProps = Readonly<{
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  version?: number;
  metadata?: Readonly<Record<string, unknown>>;
}>;

