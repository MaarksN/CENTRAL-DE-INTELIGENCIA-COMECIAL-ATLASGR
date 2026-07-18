import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { noteSchema } from '../../../lib/zod';

export class NoteService {
    async create(organizationId: string, leadId: string, data: z.infer<typeof noteSchema>) {
        const validated = noteSchema.parse(data);

        // Verify lead belongs to organization
        const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId } });
        if (!lead) throw new Error('Lead not found');

        const note = await prisma.note.create({
            data: {
                content: validated.content,
                author: validated.author,
                leadId,
            },
        });

        await prisma.timelineEvent.create({
            data: {
                type: 'comment',
                description: `Nova nota adicionada por ${validated.author}`,
                leadId,
            },
        });

        return note;
    }

    async findByLead(organizationId: string, leadId: string) {
        // Verify lead belongs to organization
        const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId } });
        if (!lead) throw new Error('Lead not found');

        return prisma.note.findMany({
            where: { leadId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async delete(organizationId: string, noteId: string) {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { lead: { select: { organizationId: true } } },
        });
        if (!note || note.lead.organizationId !== organizationId) throw new Error('Note not found');
        return prisma.note.delete({ where: { id: noteId } });
    }
}

export const noteService = new NoteService();
