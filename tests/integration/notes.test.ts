import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { LeadFactory, NoteFactory, CompanyFactory } from '../helpers/factories';

describe('Note Operations Integration', () => {
  beforeEach(async () => {
    await prisma.timelineEvent.deleteMany();
    await prisma.note.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.company.deleteMany();
  });

  it('should create a note and associate it with a lead', async () => {
    const company = await prisma.company.create({ data: CompanyFactory.build() });
    const lead = await prisma.lead.create({ data: LeadFactory.build({ companyId: company.id }) as never });
    
    const noteData = NoteFactory.build({ leadId: lead.id });
    delete (noteData as never).lead;

    const note = await prisma.note.create({
      data: noteData as never
    });

    expect(note.leadId).toBe(lead.id);
  });
});
