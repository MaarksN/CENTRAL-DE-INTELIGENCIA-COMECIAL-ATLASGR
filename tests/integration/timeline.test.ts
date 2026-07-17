import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { LeadFactory, TimelineEventFactory, CompanyFactory } from '../helpers/factories';

describe('TimelineEvent Operations Integration', () => {
  beforeEach(async () => {
    await prisma.timelineEvent.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.company.deleteMany();
  });

  it('should retrieve timeline events for a lead in chronological order', async () => {
    const company = await prisma.company.create({ data: CompanyFactory.build() });
    const lead = await prisma.lead.create({ data: LeadFactory.build({ companyId: company.id }) as never });
    
    const eventData1 = TimelineEventFactory.build({ leadId: lead.id, type: 'creation' });
    delete (eventData1 as any).lead;
    await prisma.timelineEvent.create({ data: eventData1 as never });

    const events = await prisma.timelineEvent.findMany({
      where: { leadId: lead.id },
      orderBy: { createdAt: 'asc' }
    });

    expect(events.length).toBe(1);
    expect(events[0].type).toBe('creation');
  });
});
