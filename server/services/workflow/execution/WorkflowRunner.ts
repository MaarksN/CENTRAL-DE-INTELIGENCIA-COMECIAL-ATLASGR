import { prisma } from '../../../../src/lib/prisma.js';
import { ActionRegistry } from '../registry/ActionRegistry.js';
import { ConditionRegistry } from '../registry/ConditionRegistry.js';
import { ExecutionContext } from './ExecutionContext.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';

export class WorkflowRunner {
  static async start(workflowId: string, event: IWorkflowEvent) {
    const wf = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        conditions: true,
        actions: { orderBy: { order: 'asc' } }
      }
    });

    if (!wf || wf.status !== 'active') return;

    // Create execution
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: wf.id,
        entityId: event.payload.leadId || event.payload.companyId || event.id,
        entityType: event.payload.leadId ? 'Lead' : 'Unknown',
        status: 'pending'
      }
    });

    // Run async
    this.process(execution.id, wf, event).catch(err => {
      console.error(`[WorkflowRunner] Fatal error executing ${execution.id}:`, err);
    });
  }

  static async process(executionId: string, wf: any, event: IWorkflowEvent) {
    const startTime = Date.now();
    const context = new ExecutionContext(event, executionId, wf.id);
    await context.loadEntities();

    try {
      // Evaluate conditions
      let conditionsMet = true;
      for (const condModel of wf.conditions) {
        const conditionImpl = ConditionRegistry.get(condModel.field);
        if (conditionImpl && !conditionImpl.evaluate(context, condModel.value)) {
          conditionsMet = false;
          break;
        }
      }

      if (!conditionsMet) {
        await this.finish(executionId, 'success', 'Skipped: Conditions not met', Date.now() - startTime);
        return;
      }

      // Execute actions
      for (const actionModel of wf.actions) {
        const actionImpl = ActionRegistry.get(actionModel.type);
        const step = await prisma.workflowExecutionStep.create({
          data: { executionId, actionType: actionModel.type, payload: actionModel.payload, status: 'pending' }
        });

        try {
          const payloadObj = JSON.parse(actionModel.payload || '{}');
          await actionImpl.execute(context, payloadObj);
          
          await prisma.workflowExecutionStep.update({
            where: { id: step.id },
            data: { status: 'success', durationMs: Date.now() - startTime }
          });
        } catch (err: any) {
          await prisma.workflowExecutionStep.update({
            where: { id: step.id },
            data: { status: 'error', error: err.message, durationMs: Date.now() - startTime }
          });
          throw err; // Stop workflow if step fails
        }
      }

      await this.finish(executionId, 'success', 'All steps completed', Date.now() - startTime);
    } catch (error: any) {
      await this.finish(executionId, 'error', `Failed: ${error.message}`, Date.now() - startTime);
    }
  }

  static async finish(id: string, status: string, logs: string, durationMs: number) {
    await prisma.workflowExecution.update({
      where: { id },
      data: { status, logs, durationMs, finishedAt: new Date() }
    });
  }
}
