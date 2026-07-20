/**
 * @file Tag.ts
 * @description Entidade de dominio Tag do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface TagProps {
  readonly label: string;
  readonly color: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Tag {
  private readonly _id: string;
  private readonly _label: string;
  private readonly _color: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: TagProps) {
    this._id = id;
    this._label = props.label;
    this._color = props.color;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: TagProps): Tag {
    return new Tag(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get label(): string {
    return this._label;
  }

  public get color(): string {
    return this._color;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public touch(): void {
    this._updatedAt = new Date();
  }

  public equals(other: Tag): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      label: this._label,
      color: this._color,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
