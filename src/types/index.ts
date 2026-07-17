export type LeadStatus = 'Novo Lead' | 'Qualificação' | 'Primeiro Contato' | 'Diagnóstico' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';

export interface Company {
    id: string;
    legalName: string;
    tradeName: string;
    cnpj?: string | null;
    stateRegistration?: string | null;
    segment?: string | null;
    cnae?: string | null;
    size?: string | null;
    employeeCount?: number | null;
    estimatedRevenue?: number | null;
    website?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    phones: string[];
    emails: string[];
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    owner?: string | null;
    status: string;
    tags: string[];
    observations?: string | null;
    createdAt: string;
    updatedAt: string;

    contacts?: Contact[];
    leads?: Lead[];
}

export interface Contact {
    id: string;
    name: string;
    role?: string | null;
    department?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    linkedin?: string | null;
    birthDate?: string | null;
    observations?: string | null;
    status: string;
    companyId: string;
    company?: Company;
    createdAt: string;
    updatedAt: string;
}

export interface Lead {
    id: string;
    // Backward compatibility
    name?: string | null;
    segment?: string | null;
    size?: string | null;
    location?: string | null;
    fitScore?: number | null;
    notes?: string | null;

    // CRM Core
    status: LeadStatus;
    source?: string | null;
    channel?: string | null;
    temperature?: string | null;
    score?: number | null;
    owner?: string | null;
    lastInteraction?: string | null;
    nextAction?: string | null;

    companyId?: string | null;
    company?: Company | null;
    contactId?: string | null;
    contact?: Contact | null;

    activities?: Activity[];
    timeline?: TimelineEvent[];
    internalNotes?: Note[];

    createdAt?: string;
    updatedAt?: string;
}

export interface Activity {
    id: string;
    type: string;
    owner: string;
    date: string;
    time?: string | null;
    status: string;
    observations?: string | null;
    leadId: string;
    lead?: Lead;
    createdAt: string;
    updatedAt: string;
}

export interface TimelineEvent {
    id: string;
    type: string;
    description: string;
    leadId: string;
    createdAt: string;
}

export interface Note {
    id: string;
    content: string;
    author: string;
    leadId: string;
    createdAt: string;
    updatedAt: string;
}

export interface SearchCriteria {
    segmento: string;
    localizacao: string;
    tamanhoFrota: string;
    faturamento: string;
    dorPrincipal: string;
    tecnologiaAtual: string;
}
