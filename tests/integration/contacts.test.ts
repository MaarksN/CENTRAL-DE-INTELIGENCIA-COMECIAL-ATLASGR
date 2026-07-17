import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { contactService } from '../../src/features/contacts/services/contact.service';
import { CompanyFactory, ContactFactory } from '../helpers/factories';

describe('ContactService Integration', () => {
  beforeEach(async () => {
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
  });

  describe('create', () => {
    it('should create a new contact with a company successfully', async () => {
      const company = await prisma.company.create({ data: CompanyFactory.build() });
      const data = ContactFactory.build({ companyId: company.id });
      delete (data as never).company;

      const result = await contactService.create(data as never);
      expect(result.companyId).toBe(company.id);
    });
  });
});
