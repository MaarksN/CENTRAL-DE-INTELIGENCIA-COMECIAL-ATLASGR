import { ITrigger } from '../types/ITrigger.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';

export class LeadCreatedTrigger implements ITrigger {
  public type = 'LeadCreated';

  match(event: IWorkflowEvent): boolean {
    return event.eventType === 'LeadCreated';
  }
}
