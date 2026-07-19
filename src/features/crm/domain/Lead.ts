import { Repository } from '../../../shared/domain/Repository';
import { LeadStatus, LeadTemperature } from '@prisma/client';

export interface Lead {
    id: string;
    status: LeadStatus;
    source: string | null;
    channel: string | null;
    temperature: LeadTemperature | null;
    score: number | null;
    owner: string | null;
    lastInteraction: Date | null;
    nextAction: Date | null;
    companyId: string | null;
    contactId: string | null;
    organizationId: string | null;
    createdAt: Date;
    updatedAt: Date;
    company?: any;
    contact?: any;
    activities?: any[];
    timeline?: any[];
    internalNotes?: any[];
}

export interface LeadRepository extends Repository<Lead> {
    findAllWithFilters(organizationId: string, status?: string, page?: number, limit?: number): Promise<{ data: Lead[], meta: any }>;
    updateStatus(organizationId: string, id: string, newStatus: string): Promise<Lead>;
    findAllForExport(organizationId: string): Promise<Lead[]>;
}
