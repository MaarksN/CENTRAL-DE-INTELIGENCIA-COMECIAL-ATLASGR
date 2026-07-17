import { ITool, ToolManifest } from '../Tool.js';
import { prisma } from '../../../../src/lib/prisma.js';

export class LeadTool implements ITool {
  manifest: ToolManifest = {
    name: 'LeadTool',
    description: 'Fetch and update basic Lead information from the CRM.',
    version: '1.0.0',
    parametersSchema: {}
  };

  async execute(params: any, context: any): Promise<any> {
    const action = params.action;
    
    if (action === 'get') {
      return await prisma.lead.findUnique({ where: { id: params.leadId } });
    }
    
    if (action === 'update') {
      return await prisma.lead.update({
        where: { id: params.leadId },
        data: params.data
      });
    }

    throw new Error('Invalid LeadTool action');
  }
}
