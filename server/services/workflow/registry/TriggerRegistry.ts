import { ITrigger } from '../types/ITrigger.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';

export class TriggerRegistry {
  private static triggers = new Map<string, ITrigger>();

  public static register(trigger: ITrigger) {
    this.triggers.set(trigger.type, trigger);
  }

  public static get(type: string): ITrigger {
    const trigger = this.triggers.get(type);
    if (!trigger) {
      throw new Error(`Trigger type ${type} is not registered`);
    }
    return trigger;
  }

  public static matchEvent(event: IWorkflowEvent): ITrigger[] {
    const matches: ITrigger[] = [];
    for (const trigger of this.triggers.values()) {
      if (trigger.match(event)) {
        matches.push(trigger);
      }
    }
    return matches;
  }
}
