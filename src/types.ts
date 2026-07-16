export type LeadStatus = 'Prospect' | 'Qualificado' | 'Proposta' | 'Fechado';

export interface Lead {
    id: string;
    name: string;
    segment: string;
    size: string;
    location: string;
    status: LeadStatus;
    fitScore?: number;
    notes?: string;
}

export interface SearchCriteria {
    segmento: string;
    localizacao: string;
    tamanhoFrota: string;
    faturamento: string;
    dorPrincipal: string;
    tecnologiaAtual: string;
}
