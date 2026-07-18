import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { companyService } from '../../src/features/companies/services/company.service';
import { CompanyFactory } from '../helpers/factories';

describe('CompanyService Integration', () => {
  beforeEach(async () => {
    await prisma.company.deleteMany();
  });

  describe('create', () => {
    it('should create a new company successfully', async () => {
      const data = CompanyFactory.build({ organizationId: 'test-org-id' });
      delete (data as any).id;
      const result = await companyService.create('test-org-id', data as never);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.legalName).toBe(data.legalName);
    });

    it('should fail with invalid data', async () => {
      const data = { legalName: '' };
      await expect(companyService.create('test-org-id', data as never)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const c1 = CompanyFactory.build({ legalName: 'Alpha Corp', organizationId: 'test-org-id' });
      const c2 = CompanyFactory.build({ legalName: 'Beta Inc', organizationId: 'test-org-id' });
      delete (c1 as any).id;
      delete (c2 as any).id;

      await prisma.company.create({ data: { ...c1, tags: undefined } as any });
      await prisma.company.create({ data: { ...c2, tags: undefined } as any });

      const companies = await companyService.findAll('test-org-id');
      expect(companies.data.length).toBeGreaterThanOrEqual(2);
    });
  });
});
