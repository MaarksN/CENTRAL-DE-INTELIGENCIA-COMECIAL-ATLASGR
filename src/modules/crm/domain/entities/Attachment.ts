/**
 * @file Attachment.ts
 * @description Entidade de dominio Attachment do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export interface AttachmentProps {
  readonly fileName: string;
  readonly mimeType: string;
  readonly url: string;
  readonly size: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Attachment {
  private readonly _id: string;
  private readonly _fileName: string;
  private readonly _mimeType: string;
  private readonly _url: string;
  private readonly _size: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: AttachmentProps) {
    this._id = id;
    this._fileName = props.fileName;
    this._mimeType = props.mimeType;
    this._url = props.url;
    this._size = props.size;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: AttachmentProps): Attachment {
    return new Attachment(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get fileName(): string {
    return this._fileName;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public get url(): string {
    return this._url;
  }

  public get size(): number {
    return this._size;
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

  public equals(other: Attachment): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      fileName: this._fileName,
      mimeType: this._mimeType,
      url: this._url,
      size: this._size,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
