import { ITool, ToolManifest } from '../Tool.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class ActivityTool implements ITool {
  manifest: ToolManifest = {
    name: 'ActivityTool',
    description: 'Schedule activities for human-in-the-loop approval or task assignment.',
    version: '1.0.0',
    parametersSchema: {}
  };

  async execute(params: any, context: any): Promise<any> {
    if (params.action === 'propose') {
      // Human-in-the-loop mechanism: Create activity as 'pending_approval'
      return await prisma.activity.create({
        data: {
          type: params.type || 'task',
          title: `[HIL] ${params.title}`,
          description: params.description,
          status: 'pending_approval' as any, // Needs schema update if strictly typed
          leadId: params.leadId,
        }
      });
    }

    throw new Error('Invalid ActivityTool action');
  }
}
