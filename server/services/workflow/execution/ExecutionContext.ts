import { IWorkflowEvent } from '../types/WorkflowEvent.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class ExecutionContext {
  public triggerEvent: IWorkflowEvent;
  public executionId: string;
  public workflowId: string;
  
  public lead?: any;
  public company?: any;
  public activity?: any;
  // Can be extended with cached scores, personas, etc.

  constructor(triggerEvent: IWorkflowEvent, executionId: string, workflowId: string) {
    this.triggerEvent = triggerEvent;
    this.executionId = executionId;
    this.workflowId = workflowId;
  }

  async loadEntities(): Promise<void> {
    const payload = this.triggerEvent.payload;
    if (payload?.leadId) {
      this.lead = await prisma.lead.findUnique({ where: { id: payload.leadId } });
    }
    if (payload?.companyId) {
      this.company = await prisma.company.findUnique({ where: { id: payload.companyId } });
    }
    if (payload?.activityId) {
      this.activity = await prisma.activity.findUnique({ where: { id: payload.activityId } });
    }
  }

  // Get current entity based on context priority (Lead > Company > Activity)
  getPrimaryEntity() {
    if (this.lead) return { type: 'Lead', id: this.lead.id, data: this.lead };
    if (this.company) return { type: 'Company', id: this.company.id, data: this.company };
    if (this.activity) return { type: 'Activity', id: this.activity.id, data: this.activity };
    return null;
  }
}
