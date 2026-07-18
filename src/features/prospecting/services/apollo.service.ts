import type { ProspectCriteria, ProspectCandidate, DecisionMaker } from './prospecting.service';
import { buildLocationLabel } from './prospecting.service';
import { findEmailViaHunter } from './hunter.service';

const APOLLO_SEARCH_URL = 'https://api.apollo.io/v1/organizations/search';

// limitamos aos N primeiros candidatos de cada busca para não estourar cota das APIs.
const MAX_DECISION_MAKER_LOOKUPS = 5;

export interface DecisionMakerCriteria {
    cargos?: string;
    senioridades?: string[];
    departamentos?: string[];
    cidade?: string;
    estado?: string;
    palavrasChavePerfil?: string;
    apenasEmailVerificado?: boolean;
}

interface ApolloOrganization {
    name?: string;
    website_url?: string;
    primary_domain?: string;
    estimated_num_employees?: number;
    city?: string;
    state?: string;
    industry?: string;
    linkedin_url?: string;
    phone?: string;
    primary_phone?: { number?: string };
    founded_year?: number;
    annual_revenue?: number;
    keywords?: string[];
    technology_names?: string[];
}

interface ApolloSearchResponse {
    organizations?: ApolloOrganization[];
}

function mapSegmentToKeyword(segmento: string): string {
    const s = segmento.toLowerCase();
    if (s.includes('transportadora')) return 'trucking';
    if (s.includes('embarcador')) return 'logistics';
    if (s.includes('3pl') || s.includes('operador logístico')) return 'third party logistics';
    if (s.includes('facilities') || s.includes('rh')) return 'facilities services';
    return 'logistics';
}

/**
 * Busca real de empresas via Apollo.io (Organization Search API).
 * Opcional: só executa se APOLLO_API_KEY estiver configurada no ambiente.
 * Suporta os principais filtros firmográficos documentados publicamente pela Apollo:
 * segmento/keywords, localização (cidade/estado/região), porte (faixa de funcionários),
 * faturamento estimado e nome da empresa.
 * Para os primeiros candidatos com domínio conhecido, também busca decisores reais
 * (Apollo People Search, com Hunter.io como fallback de e-mail) — ver enrichCandidatesWithDecisionMakers.
 * Como não há como validar o contrato de resposta sem uma chave real, os campos
 * abaixo seguem a documentação pública da Apollo — ajuste se o formato divergir.
 */
export async function fetchApolloCandidates(
    criteria: ProspectCriteria,
    count: number
): Promise<{ candidates: ProspectCandidate[]; error?: string }> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) return { candidates: [] };

    const extraKeywords = criteria.palavrasChave
        ? criteria.palavrasChave.split(',').map((k) => k.trim()).filter(Boolean)
        : [];

    const body: Record<string, unknown> = {
        q_organization_keyword_tags: [mapSegmentToKeyword(criteria.segmento), ...extraKeywords],
        organization_locations: [buildLocationLabel(criteria)],
        per_page: Math.min(count, 25),
        page: 1,
    };
    if (criteria.porte) {
        body.organization_num_employees_ranges = [criteria.porte];
    }
    if (criteria.nomeEmpresa) {
        body.q_organization_name = criteria.nomeEmpresa;
    }
    if (criteria.faturamentoMin != null || criteria.faturamentoMax != null) {
        body.revenue_range = {
            ...(criteria.faturamentoMin != null ? { min: criteria.faturamentoMin } : {}),
            ...(criteria.faturamentoMax != null ? { max: criteria.faturamentoMax } : {}),
        };
    }
    if (criteria.anoFundacaoMin != null || criteria.anoFundacaoMax != null) {
        body.founded_year_range = {
            ...(criteria.anoFundacaoMin != null ? { min: criteria.anoFundacaoMin } : {}),
            ...(criteria.anoFundacaoMax != null ? { max: criteria.anoFundacaoMax } : {}),
        };
    }
    if (criteria.tecnologias) {
        body.q_organization_technology_names = criteria.tecnologias.split(',').map((t) => t.trim()).filter(Boolean);
    }

    try {
        const res = await fetch(APOLLO_SEARCH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { candidates: [], error: `Apollo API respondeu ${res.status}: ${text.slice(0, 200)}` };
        }

        const data = (await res.json()) as ApolloSearchResponse;
        const organizations = data.organizations || [];

        const candidates: ProspectCandidate[] = organizations.map((org) => ({
            tradeName: org.name || 'Empresa sem nome (Apollo)',
            legalNameGuess: null,
            cnpjGuess: null,
            segment: org.industry || criteria.segmento,
            size: org.estimated_num_employees ? `~${org.estimated_num_employees} funcionários` : 'Não informado',
            location: [org.city, org.state].filter(Boolean).join(', ') || buildLocationLabel(criteria),
            fitScoreEstimate: 70,
            suggestedContact: null,
            rationale: `Encontrado via Apollo.io (busca real de firmographic data)${org.primary_domain ? ` — domínio: ${org.primary_domain}` : ''}`,
            linkedinUrl: org.linkedin_url || null,
            phone: org.phone || org.primary_phone?.number || null,
            foundedYear: org.founded_year || null,
            annualRevenue: org.annual_revenue || null,
            technologies: org.technology_names?.slice(0, 6) || undefined,
        }));

        // Removemos a busca automática de decisores para permitir que seja feita em uma etapa posterior (on demand)
        // await enrichCandidatesWithDecisionMakers(candidates, organizations);

        return { candidates };
    } catch (error) {
        return { candidates: [], error: error instanceof Error ? error.message : 'Falha ao consultar Apollo.io' };
    }
}

/** Preenche candidate.decisionMakers para os primeiros MAX_DECISION_MAKER_LOOKUPS candidatos com domínio conhecido. */
async function enrichCandidatesWithDecisionMakers(candidates: ProspectCandidate[], organizations: ApolloOrganization[]) {
    const withDomain = organizations
        .map((org, idx) => ({ org, idx }))
        .filter(({ org }) => !!org.primary_domain)
        .slice(0, MAX_DECISION_MAKER_LOOKUPS);

    await Promise.all(
        withDomain.map(async ({ org, idx }) => {
            const domain = org.primary_domain!;
            const { contacts } = await enrichOrganizationWithContacts(domain, 3);
            if (contacts.length === 0) return;

            const decisionMakers: DecisionMaker[] = await Promise.all(
                contacts.map(async (c): Promise<DecisionMaker> => {
                    let email = c.email;
                    let emailSource: DecisionMaker['emailSource'] = email ? 'apollo' : undefined;
                    if (!email) {
                        const hunterResult = await findEmailViaHunter(domain, c.name);
                        if (hunterResult.email) {
                            email = hunterResult.email;
                            emailSource = 'hunter';
                        }
                    }
                    return {
                        name: c.name,
                        title: c.title,
                        email,
                        emailSource,
                        phone: c.phone || null,
                        linkedinUrl: c.linkedin_url,
                    };
                })
            );

            candidates[idx].decisionMakers = decisionMakers;
        })
    );
}

export interface ApolloContact {
    name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    linkedin_url: string | null;
}

/**
 * Busca executivos/decisores reais para um dado domínio de empresa via Apollo People Search.
 */
export async function enrichOrganizationWithContacts(
    domain: string,
    limit: number = 3
): Promise<{ contacts: ApolloContact[]; error?: string }> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey || !domain) return { contacts: [] };

    try {
        const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify({
                q_organization_domains: domain,
                // Tentaremos pegar nível Diretor, VP, C-Level ou Gerentes
                person_seniorities: ['c_suite', 'vp', 'director', 'manager'],
                per_page: limit,
                page: 1,
            }),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { contacts: [], error: `Apollo People API respondeu ${res.status}: ${text.slice(0, 100)}` };
        }

        const data = await res.json();
        const people = data.people || data.contacts || [];

        const contacts: ApolloContact[] = people.map((p: any) => ({
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Sem Nome',
            title: p.title || null,
            email: p.email || p.email_url || null,
            phone: p.phone_numbers?.[0]?.raw_number || p.sanitized_phone || null,
            linkedin_url: p.linkedin_url || null,
        }));

        return { contacts };
    } catch (error) {
        return { contacts: [], error: error instanceof Error ? error.message : 'Falha ao consultar Apollo People API' };
    }
}

/**
 * Busca avançada de executivos/decisores para um dado domínio de empresa via Apollo People Search.
 */
export async function searchDecisionMakersAdvanced(
    domain: string,
    criteria: DecisionMakerCriteria,
    limit: number = 10
): Promise<{ contacts: DecisionMaker[]; error?: string }> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey || !domain) return { contacts: [] };

    try {
        const body: Record<string, unknown> = {
            q_organization_domains: domain,
            per_page: limit,
            page: 1,
        };

        if (criteria.cargos) {
            body.person_titles = criteria.cargos.split(',').map(c => c.trim()).filter(Boolean);
        }
        if (criteria.senioridades && criteria.senioridades.length > 0) {
            body.person_seniorities = criteria.senioridades;
        }
        if (criteria.departamentos && criteria.departamentos.length > 0) {
            body.person_departments = criteria.departamentos;
        }
        if (criteria.cidade || criteria.estado) {
            body.person_locations = [[criteria.cidade, criteria.estado].filter(Boolean).join(', ')];
        }
        if (criteria.palavrasChavePerfil) {
            body.q_keywords = criteria.palavrasChavePerfil;
        }
        if (criteria.apenasEmailVerificado) {
            body.contact_email_status = ['verified'];
        }

        const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { contacts: [], error: `Apollo People API respondeu ${res.status}: ${text.slice(0, 100)}` };
        }

        const data = await res.json();
        const people = data.people || data.contacts || [];

        const contacts: DecisionMaker[] = await Promise.all(
            people.map(async (p: any): Promise<DecisionMaker> => {
                let email = p.email || p.email_url || null;
                let emailSource: DecisionMaker['emailSource'] = email ? 'apollo' : undefined;
                
                const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Sem Nome';

                if (!email) {
                    const hunterResult = await findEmailViaHunter(domain, name);
                    if (hunterResult.email) {
                        email = hunterResult.email;
                        emailSource = 'hunter';
                    }
                }

                return {
                    name,
                    title: p.title || null,
                    email,
                    emailSource,
                    phone: p.phone_numbers?.[0]?.raw_number || p.sanitized_phone || null,
                    linkedinUrl: p.linkedin_url || null,
                };
            })
        );

        return { contacts };
    } catch (error) {
        return { contacts: [], error: error instanceof Error ? error.message : 'Falha ao consultar Apollo People API' };
    }
}

