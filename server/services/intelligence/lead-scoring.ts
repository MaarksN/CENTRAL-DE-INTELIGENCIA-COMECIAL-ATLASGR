import { prisma } from '../../../src/lib/prisma.js';

export const LeadScoringEngine = {
  async calculateTemperature(leadId: string): Promise<string> {
    const lead = await prisma.lead.findUnique({ 
      where: { id: leadId },
      include: { activities: true }
    });
    if (!lead) return 'Cold';

    let engagementScore = 0;

    // Engagement Rules
    const recentActivities = lead.activities.filter(a => 
      new Date(a.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    
    engagementScore += recentActivities.length * 5; // +5 points per recent activity
    
    // Fit Rules
    const totalScore = (lead.icpScore || 0) + engagementScore;

    let temperature = 'Cold';
    if (totalScore >= 80) temperature = 'Priority';
    else if (totalScore >= 50) temperature = 'Hot';
    else if (totalScore >= 30) temperature = 'Warm';

    await prisma.lead.update({
      where: { id: lead.id },
      data: { engagementScore, temperature }
    });

    return temperature;
  },

  async evaluateAllLeads(): Promise<void> {
    const leads = await prisma.lead.findMany({ select: { id: true } });
    for (const lead of leads) {
      await this.calculateTemperature(lead.id);
    }
  }
};
