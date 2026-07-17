import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { companySchema, type CompanyStatus } from '../../../lib/zod';
import { z } from 'zod';
import { toPrismaCompanyStatus, fromPrismaCompanyStatus } from '../../../lib/enumMap';

function serializeCompany<T extends { status: string }>(company: T): T & { status: CompanyStatus } {
    return { ...company, status: fromPrismaCompanyStatus(company.status) };
}

export class CompanyService {
    async findAll(organizationId: string, query?: string, page: number = 1, limit: number = 50) {
        const where: Prisma.CompanyWhereInput = { organizationId };
        if (query) {
            where.OR = [
                { legalName: { contains: query, mode: 'insensitive' } },
                { tradeName: { contains: query, mode: 'insensitive' } },
                { cnpj: { contains: query } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.company.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.company.count({ where })
        ]);

        return { data: data.map(serializeCompany), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(organizationId: string, id: string) {
        const company = await prisma.company.findFirst({
            where: { id, organizationId },
            include: { contacts: true, leads: true }
        });
        return company ? serializeCompany(company) : null;
    }

    async create(organizationId: string, data: z.infer<typeof companySchema>) {
        const validated = companySchema.parse(data);
        const company = await prisma.company.create({
            data: { ...validated, status: toPrismaCompanyStatus(validated.status) as any, organizationId }
        });
        return serializeCompany(company);
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof companySchema>>) {
        const current = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!current) throw new Error('Company not found');
        const company = await prisma.company.update({
            where: { id },
            data: { ...data, ...(data.status ? { status: toPrismaCompanyStatus(data.status) as any } : {}) }
        });
        return serializeCompany(company);
    }

    async delete(organizationId: string, id: string) {
        const current = await prisma.company.findFirst({ where: { id, organizationId } });
        if (!current) throw new Error('Company not found');
        return prisma.company.delete({ where: { id } });
    }
}
export const companyService = new CompanyService();
