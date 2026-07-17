import { describe, it, expect, vi, beforeEach } from 'vitest';
import { leadService } from '@/features/crm/services/lead.service';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    lead: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    timelineEvent: {
      create: vi.fn(),
    }
  }
}));

describe('LeadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLead = {
    id: '1',
    status: 'Novo Lead' as const,
    companyId: 'comp-1'
  };

  it('should create a lead and a timeline event', async () => {
    const input = { status: 'Novo Lead' as const, companyId: 'comp-1' };
    vi.mocked(prisma.lead.create).mockResolvedValue({ id: '1', ...input } as never);
    const result = await leadService.create('test-org-id', input);
    expect(prisma.lead.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        timeline: { create: { type: 'creation', description: 'Lead criado no sistema' } }
      })
    }));
    expect(result.id).toBe('1');
  });

  it('should update a lead', async () => {
    vi.mocked(prisma.lead.findFirst).mockResolvedValue(mockLead as never);
    vi.mocked(prisma.lead.update).mockResolvedValue({ ...mockLead, status: 'Primeiro Contato' } as never);
    const result = await leadService.update('test-org-id', '1', { status: 'Primeiro Contato' as const });
    expect(prisma.lead.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        timeline: { create: { type: 'edition', description: 'Dados do lead atualizados' } }
      })
    }));
    expect(result.status).toBe('Primeiro Contato');
  });
  
  it('should delete a lead', async () => {
    vi.mocked(prisma.lead.findFirst).mockResolvedValue(mockLead as never);
    vi.mocked(prisma.lead.delete).mockResolvedValue(mockLead as never);
    await leadService.delete('test-org-id', '1');
    expect(prisma.lead.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
