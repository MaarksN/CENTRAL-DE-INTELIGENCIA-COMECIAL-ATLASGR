import { GoogleGenAI } from '@google/genai';
import { prisma } from '../../../lib/prisma';
import { isValidCnpj, sanitizeCnpj } from './cnpj.util';
import { enrichCompany } from './enrichment.service';
import { fetchApolloCandidates } from './apollo.service';
import { toPrismaLeadStatus, fromPrismaLeadStatus, fromPrismaCompanyStatus } from '../../../lib/enumMap';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProspectCriteria {
    segmento: string;
    pic: string;
    persona: string;
    localizacao: string;
    quantidade: number;
}

const PIC_CONTEXT: Record<string, string> = {
    'PIC 1 — Transportadora em expansão operacional':
        'crescimento recente de frota/rotas/terceiros, sinais como vagas abertas em operações ou GR, processo ainda manual (planilha/WhatsApp)',
    'PIC 2 — Transportadora sob pressão de risco':
        'sinistro relevante recente, mudança de seguradora, processo judicial ligado a carga, pressão de seguradora/corretora',
    'PIC 3 — Empresa em transição de liderança':
        'novo Diretor de Operações ou Gerente de Risco, reestruturação anunciada, revisão de fornecedores em andamento',
};

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

const BATCH_SIZE = 20;

function extractJsonArray(text: string): unknown[] {
    const fenced = text.replace(/```json/gi, '```').split('```');
    const candidate = fenced.length > 1 ? fenced[1] : text;
    const start = candidate.indexOf('[');
    const end = candidate.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) return [];
    try {
        return JSON.parse(candidate.slice(start, end + 1));
    } catch {
        return [];
    }
}

function buildPrompt(criteria: ProspectCriteria, count: number, excludeNames: string[]): string {
    const exclusion = excludeNames.length
        ? `\nNão repita estas empresas, já sugeridas antes: ${excludeNames.join(', ')}.`
        : '';

    const picContext = PIC_CONTEXT[criteria.pic] || '';

    return `Você é um assistente de prospecção B2B (SDR/BDR) da Atlas (empresa de gerenciamento de risco e eficiência logística).
Use a busca do Google para encontrar empresas REAIS e atualmente em operação no Brasil (não invente nomes fictícios) que se encaixam neste perfil de cliente ideal (ICP):
- Segmento: ${criteria.segmento}
- Cenário/Gatilho (PIC): ${criteria.pic}${picContext ? ` — sinais típicos: ${picContext}` : ''}
- Persona/Decisor-alvo: ${criteria.persona}
- Localização: ${criteria.localizacao}

Priorize empresas com sinais públicos reais e recentes compatíveis com o cenário/gatilho acima (ex: notícia de expansão, vaga aberta de GR/operações, processo judicial público, troca de liderança anunciada).
${exclusion}

Sugira exatamente ${count} empresas.

Responda com um array JSON (dentro de um bloco \`\`\`json) de objetos, cada um com exatamente estas chaves:
{
  "tradeName": "Nome fantasia da empresa",
  "legalNameGuess": "Razão social, se souber, senão null",
  "cnpjGuess": "CNPJ com 14 dígitos SOMENTE se você tiver certeza real do número, senão null — nunca invente um CNPJ",
  "segment": "Sub-segmento específico",
  "size": "Tamanho da frota aproximado",
  "location": "Cidade, UF",
  "fitScoreEstimate": número de 0 a 100 (estimativa preliminar, será recalculado após enriquecimento),
  "suggestedContact": { "name": "Nome plausível para a persona ${criteria.persona}", "role": "${criteria.persona}" } ou null,
  "rationale": "1 frase curta explicando por que essa empresa combina com o ICP"
}`;
}

async function discoverBatch(
    criteria: ProspectCriteria,
    count: number,
    excludeNames: string[]
): Promise<DiscoverResult> {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: buildPrompt(criteria, count, excludeNames),
        config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.6,
        },
    });

    const text = response.text || '[]';
    const parsed = extractJsonArray(text) as Partial<ProspectCandidate>[];

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
        .map((chunk) => chunk.web)
        .filter((web): web is { title?: string; uri?: string } => !!web?.uri)
        .map((web) => ({ title: web.title || web.uri!, uri: web.uri! }));

    const candidates = parsed.map((c) => ({
        tradeName: c.tradeName || 'Empresa sem nome',
        legalNameGuess: c.legalNameGuess || null,
        cnpjGuess: c.cnpjGuess && isValidCnpj(sanitizeCnpj(c.cnpjGuess)) ? sanitizeCnpj(c.cnpjGuess) : null,
        segment: c.segment || criteria.segmento,
        size: c.size || 'Não informado',
        location: c.location || criteria.localizacao,
        fitScoreEstimate: typeof c.fitScoreEstimate === 'number' ? c.fitScoreEstimate : 70,
        suggestedContact: c.suggestedContact || null,
        rationale: c.rationale || '',
    }));

    return { candidates, sources };
}

/**
 * Descoberta assistida por IA: pede à Gemini (com grounding real via Google Search) empresas
 * REAIS do Brasil que combinem com o ICP. O resultado é apenas um ponto de partida — cada
 * candidato ainda passa pelo pipeline de enriquecimento real (Receita Federal) antes de virar
 * um Lead confiável. Quantidades grandes (>20) são divididas em lotes sequenciais para manter
 * a qualidade e evitar truncamento da resposta do modelo.
 */
export async function discoverCandidates(criteria: ProspectCriteria): Promise<DiscoverResult> {
    const total = Math.max(1, Math.min(100, criteria.quantidade || 10));
    const allCandidates: ProspectCandidate[] = [];
    const allSources: Array<{ title: string; uri: string }> = [];
    const seenNames = new Set<string>();

    const apollo = await fetchApolloCandidates(criteria, total);
    for (const candidate of apollo.candidates) {
        const key = candidate.tradeName.trim().toLowerCase();
        if (seenNames.has(key)) continue;
        seenNames.add(key);
        allCandidates.push(candidate);
    }

    let remaining = total - allCandidates.length;
    while (remaining > 0) {
        const batchCount = Math.min(BATCH_SIZE, remaining);
        const { candidates, sources } = await discoverBatch(criteria, batchCount, Array.from(seenNames));

        for (const candidate of candidates) {
            const key = candidate.tradeName.trim().toLowerCase();
            if (seenNames.has(key)) continue;
            seenNames.add(key);
            allCandidates.push(candidate);
        }
        allSources.push(...sources);
        remaining -= batchCount;

        if (candidates.length === 0) break; // modelo parou de retornar resultados novos
    }

    const dedupedSources = Array.from(new Map(allSources.map((s) => [s.uri, s])).values());
    return { candidates: allCandidates, sources: dedupedSources, apolloError: apollo.error };
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

/** Cria Company + Contact + Lead no CRM a partir de um candidato (IA ou busca por CNPJ) e dispara o enriquecimento real. */
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
                observations: 'Contato sugerido por IA — confirmar identidade e dados antes da abordagem.',
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
