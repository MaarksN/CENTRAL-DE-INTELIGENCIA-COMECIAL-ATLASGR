import { prisma } from '../../../lib/prisma';
import { leadSchema } from '../../../lib/zod';
import { z } from 'zod';
import { enrichCompany } from '../../prospecting/services/enrichment.service';

export class LeadService {
    async findAll(organizationId: string, status?: string, page: number = 1, limit: number = 50) {
        const where = status ? { organizationId, status } : { organizationId };
        
        const skip = (page - 1) * limit;
        
        const [data, total] = await prisma.$transaction([
            prisma.lead.findMany({
                where,
                skip,
                take: limit,
                include: { company: true, contact: true },
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.lead.count({ where })
        ]);
        
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
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

    /** Reenriquece o lead já prospectado: roda Receita Federal + heurísticas na empresa vinculada e recalcula o fit score. */
    async enrich(organizationId: string, id: string) {
        const lead = await prisma.lead.findFirst({ where: { id, organizationId }, include: { company: true } });
        if (!lead) throw new Error('Lead not found');
        if (!lead.companyId) throw new Error('Lead sem empresa vinculada — não é possível enriquecer');

        const result = await enrichCompany(lead.companyId, {
            segmentKeywords: lead.segment ? [lead.segment] : undefined,
            fleetSizeHint: lead.size || undefined,
        });

        const location = [result.company.city, result.company.state].filter(Boolean).join(', ') || lead.location;

        const updated = await prisma.lead.update({
            where: { id },
            data: {
                score: result.fit.score,
                fitScore: result.fit.score,
                temperature: result.fit.temperature,
                segment: result.company.segment ?? lead.segment,
                size: result.company.size ?? lead.size,
                location,
                timeline: {
                    create: {
                        type: 'generic',
                        description: `Lead reenriquecido — novo fit score ${result.fit.score}% (${result.fit.temperature})`,
                    },
                },
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        return { lead: updated, fit: result.fit, enrichment: result };
    }
}
export const leadService = new LeadService();
