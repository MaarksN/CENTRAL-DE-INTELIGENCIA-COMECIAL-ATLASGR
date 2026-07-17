import type { ProspectCriteria, ProspectCandidate } from './prospecting.service';

const APOLLO_SEARCH_URL = 'https://api.apollo.io/v1/organizations/search';

interface ApolloOrganization {
    name?: string;
    website_url?: string;
    primary_domain?: string;
    estimated_num_employees?: number;
    city?: string;
    state?: string;
    industry?: string;
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
 * Busca real de empresas via Apollo.io (People/Organization Search API).
 * Opcional: só executa se APOLLO_API_KEY estiver configurada no ambiente.
 * Como não há como validar o contrato de resposta sem uma chave real, os campos
 * abaixo seguem a documentação pública da Apollo — ajuste se o formato divergir.
 */
export async function fetchApolloCandidates(
    criteria: ProspectCriteria,
    count: number
): Promise<{ candidates: ProspectCandidate[]; error?: string }> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) return { candidates: [] };

    try {
        const res = await fetch(APOLLO_SEARCH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify({
                q_organization_keyword_tags: [mapSegmentToKeyword(criteria.segmento)],
                organization_locations: [criteria.localizacao],
                per_page: Math.min(count, 25),
                page: 1,
            }),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { candidates: [], error: `Apollo API respondeu ${res.status}: ${text.slice(0, 200)}` };
        }

        const data = (await res.json()) as ApolloSearchResponse;
        const candidates: ProspectCandidate[] = (data.organizations || []).map((org) => ({
            tradeName: org.name || 'Empresa sem nome (Apollo)',
            legalNameGuess: null,
            cnpjGuess: null,
            segment: org.industry || criteria.segmento,
            size: org.estimated_num_employees ? `~${org.estimated_num_employees} funcionários` : 'Não informado',
            location: [org.city, org.state].filter(Boolean).join(', ') || criteria.localizacao,
            fitScoreEstimate: 70,
            suggestedContact: null,
            rationale: `Encontrado via Apollo.io (busca real de firmographic data)${org.primary_domain ? ` — domínio: ${org.primary_domain}` : ''}`,
        }));

        return { candidates };
    } catch (error) {
        return { candidates: [], error: error instanceof Error ? error.message : 'Falha ao consultar Apollo.io' };
    }
}

export interface ApolloContact {
    name: string;
    title: string | null;
    email: string | null;
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
            linkedin_url: p.linkedin_url || null,
        }));

        return { contacts };
    } catch (error) {
        return { contacts: [], error: error instanceof Error ? error.message : 'Falha ao consultar Apollo People API' };
    }
}
