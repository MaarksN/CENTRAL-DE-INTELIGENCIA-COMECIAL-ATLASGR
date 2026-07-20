/**
 * @file Task.ts
 * @description Entidade de dominio Task do contexto CRM.
 * @module CRM/Entities
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Priority } from '../value-objects/Priority';
import type { TaskStatus } from '../value-objects/TaskStatus';

export interface TaskProps {
  readonly title: string;
  readonly description: string;
  readonly priority: Priority;
  readonly status: TaskStatus;
  readonly dueDate: Date;
  readonly assignedTo: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Task {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _priority: Priority;
  private readonly _status: TaskStatus;
  private readonly _dueDate: Date;
  private readonly _assignedTo: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: TaskProps) {
    this._id = id;
    this._title = props.title;
    this._description = props.description;
    this._priority = props.priority;
    this._status = props.status;
    this._dueDate = props.dueDate;
    this._assignedTo = props.assignedTo;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(id: string, props: TaskProps): Task {
    return new Task(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get priority(): Priority {
    return this._priority;
  }

  public get status(): TaskStatus {
    return this._status;
  }

  public get dueDate(): Date {
    return this._dueDate;
  }

  public get assignedTo(): string {
    return this._assignedTo;
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

  public equals(other: Task): boolean {
    return this._id === other.id;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      priority: this._priority,
      status: this._status,
      dueDate: this._dueDate,
      assignedTo: this._assignedTo,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
