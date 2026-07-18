import { describe, it, expect, vi, beforeEach } from 'vitest';
import { companyService } from '@/features/companies/services/company.service';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn((queries) => Promise.all(queries)),
    company: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
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
    vi.mocked(prisma.company.count).mockResolvedValue(1 as never);
    const result = await companyService.findAll('test-org-id');
    expect(prisma.company.findMany).toHaveBeenCalledWith({ where: { organizationId: 'test-org-id' }, skip: 0, take: 50, orderBy: { createdAt: 'desc' } });
    expect(result.data).toEqual([mockCompany]);
    expect(result.meta.total).toBe(1);
  });

  it('should find all companies with query', async () => {
    vi.mocked(prisma.company.findMany).mockResolvedValue([mockCompany as never]);
    vi.mocked(prisma.company.count).mockResolvedValue(1 as never);
    const result = await companyService.findAll('test-org-id', 'Test');
    expect(prisma.company.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        organizationId: 'test-org-id',
        OR: [
          { legalName: { contains: 'Test', mode: 'insensitive' } },
          { tradeName: { contains: 'Test', mode: 'insensitive' } },
          { cnpj: { contains: 'Test' } }
        ]
      },
      skip: 0,
      take: 50,
      orderBy: { createdAt: 'desc' }
    }));
    expect(result.data).toEqual([mockCompany]);
  });

  it('should find company by id', async () => {
    vi.mocked(prisma.company.findFirst).mockResolvedValue(mockCompany as never);
    const result = await companyService.findById('test-org-id', '1');
    expect(prisma.company.findFirst).toHaveBeenCalledWith({
      where: { id: '1', organizationId: 'test-org-id' },
      include: { contacts: true, leads: true }
    });
    expect(result).toEqual(mockCompany);
  });

  it('should create a company', async () => {
    const input = { legalName: 'New Corp', tradeName: 'Corp' };
    vi.mocked(prisma.company.create).mockResolvedValue({ id: '2', ...input } as never);
    const result = await companyService.create('test-org-id', input as any);
    expect(prisma.company.create).toHaveBeenCalled();
    expect(result.id).toBe('2');
  });

  it('should update a company', async () => {
    vi.mocked(prisma.company.findFirst).mockResolvedValue(mockCompany as never);
    vi.mocked(prisma.company.update).mockResolvedValue({ ...mockCompany, tradeName: 'Updated' } as never);
    const result = await companyService.update('test-org-id', '1', { tradeName: 'Updated' });
    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { tradeName: 'Updated' }
    });
    expect(result.tradeName).toBe('Updated');
  });

  it('should delete a company', async () => {
    vi.mocked(prisma.company.findFirst).mockResolvedValue(mockCompany as never);
    vi.mocked(prisma.company.delete).mockResolvedValue(mockCompany as never);
    await companyService.delete('test-org-id', '1');
    expect(prisma.company.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
