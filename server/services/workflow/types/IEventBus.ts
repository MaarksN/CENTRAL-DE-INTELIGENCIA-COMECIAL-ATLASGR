import { IWorkflowEvent } from './WorkflowEvent.js';

export type EventHandler = (event: IWorkflowEvent) => Promise<void> | void;

export interface IEventBus {
  publish(event: Omit<IWorkflowEvent, 'id' | 'createdAt' | 'status'>): Promise<string>;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}
