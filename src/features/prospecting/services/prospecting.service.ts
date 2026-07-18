import { prisma } from '../../../lib/prisma';
import { isValidCnpj, sanitizeCnpj } from './cnpj.util';
import { enrichCompany } from './enrichment.service';
import { fetchApolloCandidates } from './apollo.service';
import { searchGooglePlacesCandidates } from './places.service';
import { toPrismaLeadStatus, fromPrismaLeadStatus, fromPrismaCompanyStatus } from '../../../lib/enumMap';

export interface ProspectCriteria {
    segmento: string;
    localizacao: string;
    quantidade: number;
}

export interface ProspectCandidate {
    tradeName: string;
    legalNameGuess: string | null;
    cnpjGuess: string | null;
    segment: string;
    size: string;
    location: string;
    fitScoreEstimate: number;
    suggestedContact: { name: string; role: string } | null;
    rationale: string;
}

export interface DiscoverResult {
    candidates: ProspectCandidate[];
    sources: Array<{ title: string; uri: string }>;
    apolloError?: string;
}

/** Monta a query de busca no Google Places a partir do segmento + região do ICP. */
function buildPlacesQuery(criteria: ProspectCriteria): string {
    return `${criteria.segmento.split('(')[0].trim()} em ${criteria.localizacao}`;
}

/** Descoberta via Google Places (New) Text Search — empresas reais, sem IA generativa envolvida. */
async function discoverViaGooglePlaces(
    criteria: ProspectCriteria,
    count: number,
    excludeNames: Set<string>
): Promise<ProspectCandidate[]> {
    const query = buildPlacesQuery(criteria);
    const places = await searchGooglePlacesCandidates(query, count + excludeNames.size);

    return places
        .filter((p) => !excludeNames.has(p.tradeName.trim().toLowerCase()))
        .slice(0, count)
        .map((p) => ({
            tradeName: p.tradeName,
            legalNameGuess: null,
            cnpjGuess: null,
            segment: criteria.segmento,
            size: 'Não informado',
            location: [p.city, p.state].filter(Boolean).join(', ') || criteria.localizacao,
            fitScoreEstimate: p.rating ? Math.round(Math.min(100, p.rating * 20)) : 60,
            suggestedContact: null,
            rationale: p.rating
                ? `Encontrado via Google Places — nota ${p.rating} (${p.userRatingCount || 0} avaliações)`
                : 'Encontrado via Google Places',
        }));
}

/**
 * Descoberta de candidatos: combina Apollo.io (Organization Search) e Google Places (Text Search)
 * — nenhuma chamada a modelos generativos. Cada candidato ainda passa pelo pipeline de
 * enriquecimento real (Receita Federal + Google Places + Apollo People) antes de virar um Lead confiável.
 */
export async function discoverCandidates(criteria: ProspectCriteria): Promise<DiscoverResult> {
    const total = Math.max(1, Math.min(100, criteria.quantidade || 10));
    const allCandidates: ProspectCandidate[] = [];
    const seenNames = new Set<string>();

    const apollo = await fetchApolloCandidates(criteria, total);
    for (const candidate of apollo.candidates) {
        const key = candidate.tradeName.trim().toLowerCase();
        if (seenNames.has(key)) continue;
        seenNames.add(key);
        allCandidates.push(candidate);
    }

    const remaining = total - allCandidates.length;
    if (remaining > 0) {
        const placesCandidates = await discoverViaGooglePlaces(criteria, remaining, seenNames);
        for (const candidate of placesCandidates) {
            const key = candidate.tradeName.trim().toLowerCase();
            if (seenNames.has(key)) continue;
            seenNames.add(key);
            allCandidates.push(candidate);
        }
    }

    return { candidates: allCandidates, sources: [], apolloError: apollo.error };
}

export interface PromoteInput {
    tradeName: string;
    legalName?: string | null;
    cnpj?: string | null;
    segment?: string | null;
    size?: string | null;
    city?: string | null;
    state?: string | null;
    location?: string | null;
    source: string;
    contact?: { name: string; role?: string } | null;
    autoEnrich?: boolean;
    organizationId: string;
}

function splitLocation(location?: string | null): { city?: string; state?: string } {
    if (!location) return {};
    const parts = location.split(',').map((s) => s.trim()).filter(Boolean);
    return { city: parts[0], state: parts[1] };
}

/** Cria Company + Contact + Lead no CRM a partir de um candidato (Google Places/Apollo ou busca por CNPJ) e dispara o enriquecimento real. */
export async function promoteToCrm(input: PromoteInput) {
    const derivedLocation = splitLocation(input.location);
    const city = input.city || derivedLocation.city || null;
    const state = input.state || derivedLocation.state || null;

    const company = await prisma.company.create({
        data: {
            legalName: input.legalName || input.tradeName,
            tradeName: input.tradeName,
            cnpj: input.cnpj && isValidCnpj(input.cnpj) ? sanitizeCnpj(input.cnpj) : null,
            segment: input.segment,
            size: input.size,
            city,
            state,
            status: 'Ativo',
            tags: ['Prospecção'],
            organizationId: input.organizationId,
        },
    });

    let contact = null;
    if (input.contact?.name) {
        contact = await prisma.contact.create({
            data: {
                name: input.contact.name,
                role: input.contact.role,
                companyId: company.id,
                status: 'Ativo',
                observations: 'Contato sugerido — confirmar identidade e dados antes da abordagem.',
                organizationId: input.organizationId,
            },
        });
    }

    let enrichmentResult: Awaited<ReturnType<typeof enrichCompany>> | null = null;
    if (input.autoEnrich !== false) {
        try {
            enrichmentResult = await enrichCompany(company.id, {
                cnpj: company.cnpj || undefined,
                segmentKeywords: input.segment ? [input.segment] : undefined,
                fleetSizeHint: input.size || undefined,
            });
        } catch (error) {
            console.error('Auto-enrichment failed during promote:', error);
        }
    }

    const finalCompany = enrichmentResult?.company || company;
    const fit = enrichmentResult?.fit;

    const lead = await prisma.lead.create({
        data: {
            status: toPrismaLeadStatus('Novo Lead') as any,
            source: input.source,
            channel: 'Prospecção',
            temperature: fit?.temperature || 'Morno',
            score: fit?.score ?? null,
            companyId: finalCompany.id,
            contactId: contact?.id,
            organizationId: input.organizationId,
            timeline: {
                create: {
                    type: 'creation',
                    description: `Lead criado via ${input.source}${enrichmentResult ? ' — enriquecido automaticamente com dados da Receita Federal' : ''}`,
                },
            },
        },
        include: { company: true, contact: true, timeline: true },
    });

    return {
        lead: {
            ...lead,
            status: fromPrismaLeadStatus(lead.status),
            company: { ...lead.company, status: fromPrismaCompanyStatus(lead.company.status) },
        },
        fit,
        enrichment: enrichmentResult,
    };
}
