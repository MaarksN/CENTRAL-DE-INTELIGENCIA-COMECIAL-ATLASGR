import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { contactSchema } from '../../../lib/zod';
import { z } from 'zod';

export class ContactService {
    async findAll(organizationId: string, query?: string) {
        const where: Prisma.ContactWhereInput = { organizationId };
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
            ];
        }
        return prisma.contact.findMany({ where, include: { company: true }, orderBy: { createdAt: 'desc' } });
    }

    async findById(organizationId: string, id: string) {
        return prisma.contact.findFirst({
            where: { id, organizationId },
            include: { company: true, leads: true }
        });
    }

    async create(organizationId: string, data: z.infer<typeof contactSchema>) {
        const validated = contactSchema.parse(data);
        return prisma.contact.create({
            data: {
                ...validated,
                organizationId,
                birthDate: validated.birthDate ? new Date(validated.birthDate) : null
            }
        });
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof contactSchema>>) {
        const updateData: Prisma.ContactUpdateInput = { ...data };
        if (data.birthDate) updateData.birthDate = new Date(data.birthDate);
        // Ensure contact belongs to org
        const existing = await prisma.contact.findFirst({ where: { id, organizationId } });
        if (!existing) throw new Error('Contact not found');

        return prisma.contact.update({
            where: { id },
            data: updateData
        });
    }

    async delete(organizationId: string, id: string) {
        const existing = await prisma.contact.findFirst({ where: { id, organizationId } });
        if (!existing) throw new Error('Contact not found');
        return prisma.contact.delete({ where: { id } });
    }
}
export const contactService = new ContactService();
