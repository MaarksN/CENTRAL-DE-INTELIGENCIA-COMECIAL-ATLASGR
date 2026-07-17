import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { activitySchema } from '../../../lib/zod';
import { z } from 'zod';

export class ActivityService {
    async findAll(organizationId: string, dateStr?: string) {
        const where: Prisma.ActivityWhereInput = { organizationId };
        if (dateStr) {
            const searchDate = new Date(dateStr);
            where.date = {
                gte: new Date(searchDate.setHours(0, 0, 0, 0)),
                lt: new Date(searchDate.setHours(23, 59, 59, 999))
            };
        }
        return prisma.activity.findMany({
            where,
            include: { lead: { include: { company: true, contact: true } } },
            orderBy: { date: 'asc' }
        });
    }

    async create(organizationId: string, data: z.infer<typeof activitySchema>) {
        const validated = activitySchema.parse(data);
        return prisma.activity.create({
            data: {
                ...validated,
                organizationId,
                date: new Date(validated.date)
            }
        }).then(async (activity) => {
             await prisma.timelineEvent.create({
                data: {
                    type: 'activity',
                    description: `Atividade '${validated.type}' agendada para ${new Date(validated.date).toLocaleDateString()}`,
                    leadId: validated.leadId
                }
            });
            return activity;
        });
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof activitySchema>>) {
        const currentActivity = await prisma.activity.findFirst({ where: { id, organizationId } });
        if (!currentActivity) throw new Error('Activity not found');

        const updateData: Prisma.ActivityUpdateInput = { ...data };
        if (data.date) updateData.date = new Date(data.date);

        return prisma.activity.update({
            where: { id },
            data: updateData
        }).then(async (activity) => {
            if (data.status && data.status !== currentActivity.status) {
                await prisma.timelineEvent.create({
                    data: {
                        type: 'activity',
                        description: `Status da atividade '${currentActivity.type}' alterado para '${data.status}'`,
                        leadId: currentActivity.leadId
                    }
                });
            }
            return activity;
        });
    }

    async delete(organizationId: string, id: string) {
        const existing = await prisma.activity.findFirst({ where: { id, organizationId } });
        if (!existing) throw new Error('Activity not found');
        return prisma.activity.delete({ where: { id } });
    }
}
export const activityService = new ActivityService();
