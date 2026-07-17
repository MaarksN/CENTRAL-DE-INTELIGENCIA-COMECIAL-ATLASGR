export interface IWorkflowEvent {
  id: string;
  eventType: string;
  source: string;
  payload: any;
  status: 'pending' | 'processed' | 'failed';
  correlationId?: string;
  executionId?: string;
  createdAt: Date;
  processedAt?: Date;
}
