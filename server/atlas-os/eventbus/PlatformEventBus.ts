import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';

export class PlatformEventBus {
  static async broadcast(eventType: string, source: string, payload: unknown): Promise<string> {
    return eventBus.publish({ eventType, source, payload });
  }

  static subscribe(eventType: string, handler: (event: unknown) => Promise<void> | void): void {
    eventBus.subscribe(eventType, handler as never);
  }
}
