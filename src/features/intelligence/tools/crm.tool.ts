import { DynamicTool } from '@langchain/core/tools';
import { prisma } from '../../../lib/prisma.js';
import { LeadStatus } from '@prisma/client';

export const crmTool = new DynamicTool({
    name: 'CRMTool',
    description: 'Updates the status of a lead in the CRM.',
    func: async (input: string) => {
        try {
            const { leadId, status } = JSON.parse(input);
            const lead = await prisma.lead.update({
                where: { id: leadId },
                data: { status: status as LeadStatus }
            });
            return JSON.stringify(lead);
        } catch (e) {
            return `Error updating CRM: ${e}`;
        }
    }
});
