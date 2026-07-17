import { IEventBus, EventHandler } from '../types/IEventBus.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class MemoryEventBus implements IEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish(event: Omit<IWorkflowEvent, 'id' | 'createdAt' | 'status'>): Promise<string> {
    // Persist in EventStore
    const record = await prisma.workflowEvent.create({
      data: {
        eventType: event.eventType,
        source: event.source,
        payload: JSON.stringify(event.payload),
        correlationId: event.correlationId,
        executionId: event.executionId,
        status: 'pending'
      }
    });

    const fullEvent: IWorkflowEvent = {
      id: record.id,
      eventType: record.eventType,
      source: record.source,
      payload: event.payload,
      status: 'pending',
      correlationId: record.correlationId || undefined,
      executionId: record.executionId || undefined,
      createdAt: record.createdAt,
    };

    // Dispatch async without blocking publisher
    this.dispatch(fullEvent).catch(err => {
      console.error(`[MemoryEventBus] Error dispatching event ${fullEvent.id}:`, err);
    });

    return record.id;
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const typeHandlers = this.handlers.get(eventType);
    if (typeHandlers) {
      typeHandlers.delete(handler);
    }
  }

  private async dispatch(event: IWorkflowEvent): Promise<void> {
    try {
      const typeHandlers = this.handlers.get(event.eventType) || new Set();
      const catchAllHandlers = this.handlers.get('*') || new Set();
      
      const allHandlers = [...Array.from(typeHandlers), ...Array.from(catchAllHandlers)];
      
      for (const handler of allHandlers) {
        await handler(event);
      }

      await prisma.workflowEvent.update({
        where: { id: event.id },
        data: {
          status: 'processed',
          processedAt: new Date()
        }
      });
    } catch (err) {
      console.error(`[MemoryEventBus] Event ${event.id} failed`, err);
      await prisma.workflowEvent.update({
        where: { id: event.id },
        data: {
          status: 'failed',
          processedAt: new Date()
        }
      });
    }
  }
}

// Singleton instance
export const eventBus = new MemoryEventBus();
