import { ContactRepository } from '../domain/Contact';
import { z } from 'zod';
import { contactSchema } from '../../../lib/zod';
import { enrichCompany } from '../../prospecting/services/enrichment.service';

export class ContactUseCases {
    constructor(private contactRepository: ContactRepository) {}

    async findContacts(organizationId: string, query?: string, page: number = 1, limit: number = 50) {
        return this.contactRepository.findAllWithFilters(organizationId, query, page, limit);
    }

    async findContactById(organizationId: string, id: string) {
        return this.contactRepository.findById!(organizationId, id);
    }

    async createContact(organizationId: string, data: z.infer<typeof contactSchema>) {
        const validated = contactSchema.parse(data);
        return this.contactRepository.create!(organizationId, validated);
    }

    async updateContact(organizationId: string, id: string, data: Partial<z.infer<typeof contactSchema>>) {
        return this.contactRepository.update!(organizationId, id, data);
    }

    async deleteContact(organizationId: string, id: string) {
        return this.contactRepository.delete!(organizationId, id);
    }

    async enrichContact(organizationId: string, id: string) {
        const contact = await this.contactRepository.findById!(organizationId, id);
        if (!contact) throw new Error('Contact not found');
        if (!contact.companyId) throw new Error('Contato sem empresa vinculada — não é possível enriquecer');

        const result = await enrichCompany(contact.companyId, {});
        const updated = await this.contactRepository.findById!(organizationId, id);

        return { contact: updated, fit: result.fit, enrichment: result };
    }
}
