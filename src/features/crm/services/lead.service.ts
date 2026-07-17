import { prisma } from '../../../lib/prisma';
import { leadSchema } from '../../../lib/zod';
import { z } from 'zod';

export class LeadService {
    async findAll(organizationId: string, status?: string) {
        const where = status ? { organizationId, status } : { organizationId };
        return prisma.lead.findMany({
            where,
            include: { company: true, contact: true },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findById(organizationId: string, id: string) {
        return prisma.lead.findFirst({
            where: { id, organizationId },
            include: {
                company: true,
                contact: true,
                activities: { orderBy: { date: 'desc' } },
                timeline: { orderBy: { createdAt: 'desc' } },
                internalNotes: { orderBy: { createdAt: 'desc' } }
            }
        });
    }

    async create(organizationId: string, data: z.infer<typeof leadSchema>) {
        const validated = leadSchema.parse(data);
        return prisma.lead.create({
            data: {
                ...validated,
                organizationId,
                timeline: {
                    create: {
                        type: 'creation',
                        description: 'Lead criado no sistema'
                    }
                }
            },
            include: { company: true, contact: true }
        });
    }

    async updateStatus(organizationId: string, id: string, newStatus: string) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        return prisma.lead.update({
            where: { id },
            data: {
                status: newStatus,
                timeline: {
                    create: {
                        type: 'movement',
                        description: `Lead movido de '${currentLead.status}' para '${newStatus}'`
                    }
                }
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof leadSchema>>) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        return prisma.lead.update({
            where: { id },
            data: {
                ...data,
                timeline: {
                    create: {
                        type: 'edition',
                        description: 'Dados do lead atualizados'
                    }
                }
            }
        });
    }

    async delete(organizationId: string, id: string) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');
        return prisma.lead.delete({ where: { id } });
    }
}
export const leadService = new LeadService();
