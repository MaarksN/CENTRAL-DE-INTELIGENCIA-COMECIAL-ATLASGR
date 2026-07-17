import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { companySchema } from '../../../lib/zod';
import { z } from 'zod';

export class CompanyService {
    async findAll(organizationId: string, query?: string) {
        const where: Prisma.CompanyWhereInput = { organizationId };
        if (query) {
            where.OR = [
                { legalName: { contains: query, mode: 'insensitive' } },
                { tradeName: { contains: query, mode: 'insensitive' } },
                { cnpj: { contains: query } }
            ];
        }
        return prisma.company.findMany({ where, orderBy: { createdAt: 'desc' } });
    }

    async findById(organizationId: string, id: string) {
        return prisma.company.findFirst({
            where: { id, organizationId },
            include: { contacts: true, leads: true }
        });
    }

    async create(organizationId: string, data: z.infer<typeof companySchema>) {
        const validated = companySchema.parse(data);
        return prisma.company.create({ data: { ...validated, organizationId } });
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof companySchema>>) {
        const current = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!current) throw new Error('Company not found');
        return prisma.company.update({
            where: { id },
            data
        });
    }

    async delete(organizationId: string, id: string) {
        const current = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!current) throw new Error('Company not found');
        return prisma.company.delete({ where: { id } });
    }
}
export const companyService = new CompanyService();
