/**
 * @file TaskFactory.ts
 * @description Factory responsavel pela criacao consistente de instancias de Task.
 * @module CRM/Factories
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


import type { Task, TaskProps } from '../entities/Task';

export class TaskFactory {
  public static build(id: string, props: TaskProps): Task {
    return Task.create(id, props);
  }
}
