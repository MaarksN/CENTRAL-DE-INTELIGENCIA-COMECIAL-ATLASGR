import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { activityService } from '../../src/features/activities/services/activity.service';
import { LeadFactory, ActivityFactory, CompanyFactory } from '../helpers/factories';

describe('ActivityService Integration', () => {
  beforeEach(async () => {
    await prisma.timelineEvent.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.company.deleteMany();
  });

  describe('create', () => {
    it('should create a new activity and generate a timeline event', async () => {
      const company = await prisma.company.create({ data: CompanyFactory.build() });
      const lead = await prisma.lead.create({ data: LeadFactory.build({ companyId: company.id }) as never });
      
      const data = ActivityFactory.build({ leadId: lead.id, date: new Date().toISOString() as never });
      delete (data as never).lead;

      const result = await activityService.create(data as never);
      expect(result.leadId).toBe(lead.id);

      const timelineEvents = await prisma.timelineEvent.findMany({ where: { leadId: lead.id, type: 'activity' } });
      expect(timelineEvents.length).toBeGreaterThan(0);
    });
  });
});
