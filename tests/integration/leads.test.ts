import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { leadService } from '../../src/features/crm/services/lead.service';
import { CompanyFactory, LeadFactory } from '../helpers/factories';

describe('LeadService Integration', () => {
  beforeEach(async () => {
    await prisma.timelineEvent.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.company.deleteMany();
  });

  describe('create', () => {
    it('should create a new lead successfully and generate a timeline event', async () => {
      const company = await prisma.company.create({ data: CompanyFactory.build() });
      const data = LeadFactory.build({ companyId: company.id });

      const result = await leadService.create(data as never);
      
      expect(result).toBeDefined();
      expect(result.companyId).toBe(company.id);

      const timelineEvents = await prisma.timelineEvent.findMany({ where: { leadId: result.id } });
      expect(timelineEvents.length).toBeGreaterThan(0);
      expect(timelineEvents[0].type).toBe('creation');
    });
  });
});
