import { prisma } from '../../../lib/prisma';
import { leadSchema, type LeadStatus } from '../../../lib/zod';
import { z } from 'zod';
import { enrichCompany } from '../../prospecting/services/enrichment.service';
import { toPrismaLeadStatus, fromPrismaLeadStatus } from '../../../lib/enumMap';

function serializeLead<T extends { status: string }>(lead: T): T & { status: LeadStatus } {
    return { ...lead, status: fromPrismaLeadStatus(lead.status) };
}

export class LeadService {
    async findAll(organizationId: string, status?: string, page: number = 1, limit: number = 50) {
        const where = status ? { organizationId, status: toPrismaLeadStatus(status as LeadStatus) as any } : { organizationId };

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

        return { data: data.map(serializeLead), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(organizationId: string, id: string) {
        const lead = await prisma.lead.findFirst({
            where: { id, organizationId },
            include: {
                company: true,
                contact: true,
                activities: { orderBy: { date: 'desc' } },
                timeline: { orderBy: { createdAt: 'desc' } },
                internalNotes: { orderBy: { createdAt: 'desc' } }
            }
        });
        return lead ? serializeLead(lead) : null;
    }

    async create(organizationId: string, data: z.infer<typeof leadSchema>) {
        const validated = leadSchema.parse(data);
        const lead = await prisma.lead.create({
            data: {
                ...validated,
                status: toPrismaLeadStatus(validated.status) as any,
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
        return serializeLead(lead);
    }

    async updateStatus(organizationId: string, id: string, newStatus: string) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        const previousStatusLabel = fromPrismaLeadStatus(currentLead.status);
        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status: toPrismaLeadStatus(newStatus as LeadStatus) as any,
                timeline: {
                    create: {
                        type: 'movement',
                        description: `Lead movido de '${previousStatusLabel}' para '${newStatus}'`
                    }
                }
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });
        return serializeLead(lead);
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof leadSchema>>) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                ...data,
                ...(data.status ? { status: toPrismaLeadStatus(data.status) as any } : {}),
                timeline: {
                    create: {
                        type: 'edition',
                        description: 'Dados do lead atualizados'
                    }
                }
            }
        });
        return serializeLead(lead);
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
            segmentKeywords: lead.company?.segment ? [lead.company.segment] : undefined,
            fleetSizeHint: lead.company?.size || undefined,
        });

        const updated = await prisma.lead.update({
            where: { id },
            data: {
                score: result.fit.score,
                temperature: result.fit.temperature,
                timeline: {
                    create: {
                        type: 'generic',
                        description: `Lead reenriquecido — novo fit score ${result.fit.score}% (${result.fit.temperature})`,
                    },
                },
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        return { lead: serializeLead(updated), fit: result.fit, enrichment: result };
    }
}
export const leadService = new LeadService();
