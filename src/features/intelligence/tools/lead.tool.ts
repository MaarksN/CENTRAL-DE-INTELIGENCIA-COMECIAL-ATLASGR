import { DynamicTool } from '@langchain/core/tools';
import { prisma } from '../../../lib/prisma.js';

export const leadTool = new DynamicTool({
    name: 'LeadTool',
    description: 'Retrieves contact information for a lead.',
    func: async (contactId: string) => {
        try {
            const contact = await prisma.contact.findUnique({
                where: { id: contactId }
            });
            return JSON.stringify(contact);
        } catch (e) {
            return `Error finding contact: ${e}`;
        }
    }
});
