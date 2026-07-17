import { prisma } from '../../../lib/prisma';
import { contactSchema } from '../../../lib/zod';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export class ContactService {
    async findAll(query?: string) {
        const where: Prisma.ContactWhereInput = query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
            ]
        } : {};
        return prisma.contact.findMany({ where, include: { company: true }, orderBy: { createdAt: 'desc' } });
    }

    async findById(id: string) {
        return prisma.contact.findUnique({
            where: { id },
            include: { company: true, leads: true }
        });
    }

    async create(data: z.infer<typeof contactSchema>) {
        const validated = contactSchema.parse(data);
        return prisma.contact.create({
            data: {
                ...validated,
                birthDate: validated.birthDate ? new Date(validated.birthDate) : null
            }
        });
    }

    async update(id: string, data: Partial<z.infer<typeof contactSchema>>) {
        const updateData: Partial<z.infer<typeof contactSchema>> & { birthDate?: Date } = { ...data };
        if (data.birthDate) updateData.birthDate = new Date(data.birthDate);
        return prisma.contact.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return prisma.contact.delete({ where: { id } });
    }
}
export const contactService = new ContactService();
