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
      const data = CompanyFactory.build();
      const result = await companyService.create(data as never);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.legalName).toBe(data.legalName);
    });

    it('should fail with invalid data', async () => {
      const data = { legalName: '' };
      await expect(companyService.create(data as never)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      await prisma.company.create({ data: CompanyFactory.build({ legalName: 'Alpha Corp' }) });
      await prisma.company.create({ data: CompanyFactory.build({ legalName: 'Beta Inc' }) });

      const companies = await companyService.findAll();
      expect(companies.length).toBeGreaterThanOrEqual(2);
    });
  });
});
