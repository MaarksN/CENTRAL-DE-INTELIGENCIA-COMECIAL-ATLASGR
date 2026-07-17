import { prisma } from '../../../src/lib/prisma.js';

export const RecommendationEngine = {
  async generateRecommendations(): Promise<void> {
    // Clear old pending recommendations
    await prisma.recommendation.deleteMany({
      where: { status: 'pending' }
    });

    // 1. Forgotten Opportunities (Deals open, no activity in > 15 days)
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const forgottenDeals = await prisma.deal.findMany({
      where: {
        status: 'open',
        updatedAt: { lt: fifteenDaysAgo },
      }
    });

    for (const deal of forgottenDeals) {
      await prisma.recommendation.create({
        data: {
          entityId: deal.id,
          entityType: 'deal',
          type: 'forgotten_opportunity',
          message: `Oportunidade "${deal.title}" sem interação há mais de 15 dias.`,
          priority: 'high'
        }
      });
    }

    // 2. Priority Leads (Hot or Priority temperature, no recent activity)
    const priorityLeads = await prisma.lead.findMany({
      where: {
        temperature: { in: ['Hot', 'Priority'] },
        status: 'Prospect'
      }
    });

    for (const lead of priorityLeads) {
      await prisma.recommendation.create({
        data: {
          entityId: lead.id,
          entityType: 'lead',
          type: 'priority_lead',
          message: `Lead "${lead.name}" está quente/prioritário. Aja rápido!`,
          priority: 'critical'
        }
      });
    }

    // 3. Overdue Follow-ups (Activities with dueDate in the past and status pending)
    const overdueActivities = await prisma.activity.findMany({
      where: {
        status: 'pending',
        dueDate: { lt: new Date() }
      }
    });

    for (const activity of overdueActivities) {
      await prisma.recommendation.create({
        data: {
          entityId: activity.id,
          entityType: 'activity',
          type: 'overdue_followup',
          message: `Follow-up atrasado: ${activity.title}`,
          priority: 'high'
        }
      });
    }
  },

  async getRecommendations() {
    return prisma.recommendation.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' }
    });
  }
};
