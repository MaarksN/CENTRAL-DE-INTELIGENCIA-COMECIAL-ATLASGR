import { IWorkflowEvent } from '../types/WorkflowEvent.js';

export interface ITrigger {
  type: string;
  match(event: IWorkflowEvent): boolean;
}
