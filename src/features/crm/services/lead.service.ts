import { prisma } from '../../../lib/prisma';
import { leadSchema } from '../../../lib/zod';
import { z } from 'zod';

export class LeadService {
    async findAll(status?: string) {
        const where = status ? { status } : {};
        return prisma.lead.findMany({
            where,
            include: { company: true, contact: true, activities: true, timeline: true, internalNotes: true },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findById(id: string) {
        return prisma.lead.findUnique({
            where: { id },
            include: {
                company: true,
                contact: true,
                activities: { orderBy: { date: 'desc' } },
                timeline: { orderBy: { createdAt: 'desc' } },
                internalNotes: { orderBy: { createdAt: 'desc' } }
            }
        });
    }

    async create(data: z.infer<typeof leadSchema>) {
        const validated = leadSchema.parse(data);
        return prisma.lead.create({
            data: {
                ...validated,
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

    async updateStatus(id: string, newStatus: string) {
        const currentLead = await prisma.lead.findUnique({ where: { id } });
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

    async update(id: string, data: Partial<z.infer<typeof leadSchema>>) {
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

    async delete(id: string) {
        return prisma.lead.delete({ where: { id } });
    }
}
export const leadService = new LeadService();
