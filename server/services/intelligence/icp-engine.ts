import { prisma } from '../../../src/lib/prisma.js';

export const ICPEngine = {
  async calculateLeadICP(leadId: string): Promise<number> {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return 0;

    const profiles = await prisma.iCPProfile.findMany();
    if (profiles.length === 0) return 0;

    let bestScore = 0;

    for (const profile of profiles) {
      let currentScore = profile.baseScore || 0;

      // Segment Matching
      if (lead.segment && profile.segments.includes(lead.segment)) {
        currentScore += 20;
      }

      // Location / Region Matching
      if (lead.location && profile.regions.includes(lead.location)) {
        currentScore += 10;
      }

      // We can expand this with more rules (size, cnae, etc) if we have the data
      if (currentScore > bestScore) {
        bestScore = currentScore;
      }
    }

    // Normalize to 0-100
    const normalizedScore = Math.min(100, Math.max(0, bestScore));

    await prisma.lead.update({
      where: { id: lead.id },
      data: { icpScore: normalizedScore }
    });

    return normalizedScore;
  },

  async evaluateAllLeads(): Promise<void> {
    const leads = await prisma.lead.findMany({ select: { id: true } });
    for (const lead of leads) {
      await this.calculateLeadICP(lead.id);
    }
  }
};
