import { prisma } from '../../../lib/prisma';
import { companySchema } from '../../../lib/zod';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export class CompanyService {
    async findAll(query?: string) {
        const where: Prisma.CompanyWhereInput = query ? {
            OR: [
                { legalName: { contains: query, mode: 'insensitive' } },
                { tradeName: { contains: query, mode: 'insensitive' } },
                { cnpj: { contains: query } }
            ]
        } : {};
        return prisma.company.findMany({ where, orderBy: { createdAt: 'desc' } });
    }

    async findById(id: string) {
        return prisma.company.findUnique({
            where: { id },
            include: { contacts: true, leads: true }
        });
    }

    async create(data: z.infer<typeof companySchema>) {
        const validated = companySchema.parse(data);
        return prisma.company.create({ data: validated });
    }

    async update(id: string, data: Partial<z.infer<typeof companySchema>>) {
        return prisma.company.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return prisma.company.delete({ where: { id } });
    }
}
export const companyService = new CompanyService();
