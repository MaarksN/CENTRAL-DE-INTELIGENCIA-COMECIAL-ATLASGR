import { IAction } from '../types/IAction.js';
import { ExecutionContext } from '../execution/ExecutionContext.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class CreateActivityAction implements IAction {
  public type = 'CreateActivity';

  async execute(context: ExecutionContext, payload: any): Promise<void> {
    const primary = context.getPrimaryEntity();
    if (!primary) throw new Error('No primary entity found in context for CreateActivity');

    await prisma.activity.create({
      data: {
        type: payload.type || 'task',
        title: payload.title || 'Auto-generated Task',
        description: payload.description,
        status: 'pending',
        leadId: primary.type === 'Lead' ? primary.id : undefined,
        companyId: primary.type === 'Company' ? primary.id : undefined,
      }
    });
  }
}
