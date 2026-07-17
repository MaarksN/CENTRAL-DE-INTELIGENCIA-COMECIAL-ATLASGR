import { describe, it, expect, vi, beforeEach } from 'vitest';
import { companyService } from '@/features/companies/services/company.service';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    company: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

describe('CompanyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCompany = {
    id: '1',
    legalName: 'Test Company',
    tradeName: 'Test',
    status: 'Ativo',
    phones: [],
    emails: [],
    tags: []
  };

  it('should find all companies without query', async () => {
    vi.mocked(prisma.company.findMany).mockResolvedValue([mockCompany as never]);
    const result = await companyService.('test-org-id', );
    expect(prisma.company.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { createdAt: 'desc' } });
    expect(result).toEqual([mockCompany]);
  });

  it('should find all companies with query', async () => {
    vi.mocked(prisma.company.findMany).mockResolvedValue([mockCompany as never]);
    const result = await companyService.('test-org-id', 'Test');
    expect(prisma.company.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [
          { legalName: { contains: 'Test', mode: 'insensitive' } },
          { tradeName: { contains: 'Test', mode: 'insensitive' } },
          { cnpj: { contains: 'Test' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    }));
    expect(result).toEqual([mockCompany]);
  });

  it('should find company by id', async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue(mockCompany as never);
    const result = await companyService.('test-org-id', '1');
    expect(prisma.company.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { contacts: true, leads: true }
    });
    expect(result).toEqual(mockCompany);
  });

  it('should create a company', async () => {
    const input = { legalName: 'New Corp', tradeName: 'Corp' };
    vi.mocked(prisma.company.create).mockResolvedValue({ id: '2', ...input } as never);
    const result = await companyService.('test-org-id', input);
    expect(prisma.company.create).toHaveBeenCalled();
    expect(result.id).toBe('2');
  });

  it('should update a company', async () => {
    vi.mocked(prisma.company.update).mockResolvedValue({ ...mockCompany, tradeName: 'Updated' } as never);
    const result = await companyService.('test-org-id', '1', { tradeName: 'Updated' });
    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { tradeName: 'Updated' }
    });
    expect(result.tradeName).toBe('Updated');
  });

  it('should delete a company', async () => {
    vi.mocked(prisma.company.delete).mockResolvedValue(mockCompany as never);
    await companyService.('test-org-id', '1');
    expect(prisma.company.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
