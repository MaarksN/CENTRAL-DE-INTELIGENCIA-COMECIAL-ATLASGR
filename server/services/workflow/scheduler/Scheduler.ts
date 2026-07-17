import { prisma } from '../../../../src/lib/prisma.js';
import { IWorkflowEvent } from '../types/WorkflowEvent.js';
import { eventBus } from '../bus/MemoryEventBus.js';

export interface IScheduler {
  scheduleEvent(event: IWorkflowEvent, runAt: Date): Promise<void>;
  processDueTasks(): Promise<void>;
}

export class DBScheduler implements IScheduler {
  async scheduleEvent(event: IWorkflowEvent, runAt: Date): Promise<void> {
    await prisma.scheduledTask.create({
      data: {
        type: 'EventDispatch',
        payload: JSON.stringify(event),
        runAt,
        status: 'pending'
      }
    });
    console.log(`[Scheduler] Task scheduled for ${runAt.toISOString()}`);
  }

  async processDueTasks(): Promise<void> {
    // In a real env, this would run every minute via a Cron Job (node-cron)
    const dueTasks = await prisma.scheduledTask.findMany({
      where: {
        status: 'pending',
        runAt: { lte: new Date() }
      }
    });

    for (const task of dueTasks) {
      try {
        await prisma.scheduledTask.update({
          where: { id: task.id },
          data: { status: 'processing' }
        });

        if (task.type === 'EventDispatch') {
          const event = JSON.parse(task.payload) as IWorkflowEvent;
          await eventBus.publish(event);
        }

        await prisma.scheduledTask.update({
          where: { id: task.id },
          data: { status: 'completed' }
        });
      } catch (err) {
        console.error(`[Scheduler] Failed to process task ${task.id}:`, err);
        await prisma.scheduledTask.update({
          where: { id: task.id },
          data: { status: 'failed' }
        });
      }
    }
  }
}

export const scheduler = new DBScheduler();
