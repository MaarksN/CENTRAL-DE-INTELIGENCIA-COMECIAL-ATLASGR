import { Company, CompanyRepository } from '../domain/Company';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export class PrismaCompanyRepository implements CompanyRepository {
    async findAllWithFilters(organizationId: string, query?: string, page: number = 1, limit: number = 50): Promise<{ data: Company[], meta: any }> {
        const where: Prisma.CompanyWhereInput = { organizationId };

        if (query) {
            where.OR = [
                { tradeName: { contains: query, mode: 'insensitive' } },
                { legalName: { contains: query, mode: 'insensitive' } },
                { cnpj: { contains: query, mode: 'insensitive' } },
                { emails: { hasSome: [query] } },
                { phones: { hasSome: [query] } },
                { website: { contains: query, mode: 'insensitive' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.company.findMany({ where, skip, take: limit, include: { contacts: true, leads: true }, orderBy: { createdAt: 'desc' } }),
            prisma.company.count({ where })
        ]);

        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(organizationId: string, id: string): Promise<Company | null> {
        return prisma.company.findFirst({
            where: { id, organizationId },
            include: { contacts: true, leads: true }
        });
    }

    async create(organizationId: string, data: any): Promise<Company> {
        return prisma.company.create({
            data: { ...data, organizationId }
        });
    }

    async update(organizationId: string, id: string, data: any): Promise<Company> {
        const existing = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!existing) throw new Error('Company not found');

        return prisma.company.update({
            where: { id },
            data
        });
    }

    async delete(organizationId: string, id: string): Promise<Company> {
        const existing = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!existing) throw new Error('Company not found');
        return prisma.company.delete({ where: { id } });
    }
}
