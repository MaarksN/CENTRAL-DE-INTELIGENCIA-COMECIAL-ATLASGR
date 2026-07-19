import { prisma } from '../../../lib/prisma.js';
import { isValidCnpj, sanitizeCnpj, formatCnpj } from './cnpj.util';
import { searchGooglePlace } from './places.service';
import { enrichOrganizationWithContacts } from './apollo.service';
import { fromPrismaCompanyStatus } from '../../../lib/enumMap';

const BRASIL_API_BASE = 'https://brasilapi.com.br/api';

// BrasilAPI está atrás de um CDN que retorna 403 para o User-Agent padrão do fetch/undici do Node.
// Um header de navegador real resolve — não é bypass de auth, é só evitar o bloqueio de bots do CDN.
const BRASIL_API_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    Accept: 'application/json',
};

// Mapeia código de porte da Receita Federal para uma faixa de funcionários estimada.
// A Receita não expõe headcount real, então isso é uma estimativa explícita — nunca
// apresentada como dado oficial.
const PORTE_TO_EMPLOYEE_ESTIMATE: Record<number, { label: string; count: number }> = {
    1: { label: '1-9 (estimado)', count: 5 },
    2: { label: '1-9 (estimado)', count: 5 },
    3: { label: '10-49 (estimado)', count: 25 },
    5: { label: '50-500+ (estimado)', count: 120 },
};

interface BrasilApiCnpjResponse {
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    descricao_situacao_cadastral: string;
    natureza_juridica: string;
    capital_social: number;
    data_inicio_atividade: string;
    cnae_fiscal: number;
    cnae_fiscal_descricao: string;
    porte: string;
    codigo_porte: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    ddd_telefone_1: string;
    ddd_telefone_2: string;
    email: string | null;
    qsa: Array<{ nome_socio: string; qualificacao_socio: string }>;
}

export interface CnpjLookupResult {
    found: boolean;
    cnpj: string;
    source: 'BrasilAPI-CNPJ';
    data?: {
        legalName: string;
        tradeName: string;
        situacaoCadastral: string;
        naturezaJuridica: string;
        capitalSocial: number;
        dataAbertura: string;
        cnae: string;
        cnaeDescription: string;
        size: string;
        employeeCountEstimate: number;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phones: string[];
        emails: string[];
        qsa: Array<{ nome: string; qualificacao: string }>;
    };
    raw?: BrasilApiCnpjResponse;
    error?: string;
}

/** Fetch com timeout + retry (1 nova tentativa em erro de rede/timeout) — BrasilAPI ocasionalmente é lenta ou instável. */
async function fetchWithRetry(url: string, init: RequestInit, attempts = 2, timeoutMs = 8000): Promise<Response> {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'brasilapi.com.br') {
        throw new Error('invalid_upstream_url');
    }

    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { ...init, signal: controller.signal });
            clearTimeout(timeout);
            if (res.status >= 500 && attempt < attempts) continue; // erro do servidor upstream — tenta de novo
            return res;
        } catch (error) {
            clearTimeout(timeout);
            lastError = error;
            if (attempt >= attempts) throw error;
        }
    }
    throw lastError;
}

function formatPhone(ddd_telefone: string): string | null {
    const digits = (ddd_telefone || '').replace(/\D/g, '');
    if (digits.length < 10) return null;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    return rest.length === 9
        ? `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
        : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
}

/** Consulta dados cadastrais reais de um CNPJ na Receita Federal via BrasilAPI (fonte oficial, gratuita, sem chave). */
export async function fetchCnpjData(cnpjRaw: string): Promise<CnpjLookupResult> {
    const cnpj = sanitizeCnpj(cnpjRaw);
    if (!isValidCnpj(cnpj)) {
        return { found: false, cnpj: cnpjRaw, source: 'BrasilAPI-CNPJ', error: 'invalid_format' };
    }

    let res: Response;
    try {
        res = await fetchWithRetry(`${BRASIL_API_BASE}/cnpj/v1/${cnpj}`, { headers: BRASIL_API_HEADERS });
    } catch (error) {
        const reason = error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network_error';
        return { found: false, cnpj: formatCnpj(cnpj), source: 'BrasilAPI-CNPJ', error: reason };
    }
    if (res.status === 404) {
        return { found: false, cnpj: formatCnpj(cnpj), source: 'BrasilAPI-CNPJ', error: 'not_found' };
    }
    if (!res.ok) {
        return { found: false, cnpj: formatCnpj(cnpj), source: 'BrasilAPI-CNPJ', error: `upstream_error_${res.status}` };
    }

    const raw = (await res.json()) as BrasilApiCnpjResponse;
    const employeeEstimate = PORTE_TO_EMPLOYEE_ESTIMATE[raw.codigo_porte] ?? PORTE_TO_EMPLOYEE_ESTIMATE[5];

    const addressParts = [raw.logradouro, raw.numero, raw.complemento, raw.bairro].filter(Boolean);
    const phones = [formatPhone(raw.ddd_telefone_1), formatPhone(raw.ddd_telefone_2)].filter(
        (p): p is string => !!p
    );

    return {
        found: true,
        cnpj: formatCnpj(cnpj),
        source: 'BrasilAPI-CNPJ',
        raw,
        data: {
            legalName: raw.razao_social,
            tradeName: raw.nome_fantasia || raw.razao_social,
            situacaoCadastral: raw.descricao_situacao_cadastral,
            naturezaJuridica: raw.natureza_juridica,
            capitalSocial: raw.capital_social,
            dataAbertura: raw.data_inicio_atividade,
            cnae: String(raw.cnae_fiscal),
            cnaeDescription: raw.cnae_fiscal_descricao,
            size: raw.porte,
            employeeCountEstimate: employeeEstimate.count,
            address: addressParts.join(', '),
            city: raw.municipio,
            state: raw.uf,
            zipCode: raw.cep,
            phones,
            emails: raw.email ? [raw.email] : [],
            qsa: (raw.qsa || []).map((s) => ({ nome: s.nome_socio, qualificacao: s.qualificacao_socio })),
        },
    };
}

export interface CepLookupResult {
    found: boolean;
    source: 'BrasilAPI-CEP';
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
}

/** Consulta endereço real por CEP via BrasilAPI (Correios), usada quando o CNPJ não traz endereço completo. */
export async function fetchCepData(cepRaw: string): Promise<CepLookupResult> {
    const cep = (cepRaw || '').replace(/\D/g, '');
    if (cep.length !== 8) return { found: false, source: 'BrasilAPI-CEP' };

    try {
        const res = await fetchWithRetry(`${BRASIL_API_BASE}/cep/v2/${cep}`, { headers: BRASIL_API_HEADERS });
        if (!res.ok) return { found: false, source: 'BrasilAPI-CEP' };
        const data = await res.json();
        return {
            found: true,
            source: 'BrasilAPI-CEP',
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
        };
    } catch {
        return { found: false, source: 'BrasilAPI-CEP' };
    }
}

function slugify(name: string): string {
    return (name || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/(ltda|me|eireli|s\/a|sa|epp)\b/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join('');
}

export interface DomainGuess {
    domain: string;
    verified: boolean;
    emails: string[];
}

/**
 * Heurística de descoberta de domínio/e-mail (SDR manual faz isso o tempo todo):
 * deriva um domínio provável a partir do nome e tenta uma verificação HTTP real.
 * Se o domínio responder, marcamos como "verificado"; caso contrário é só uma sugestão.
 */
export async function guessDomainAndEmails(companyName: string): Promise<DomainGuess> {
    const slug = slugify(companyName);
    const domain = slug ? `${slug}.com.br` : '';
    let verified = false;

    if (domain) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(`https://${domain}`, { method: 'HEAD', signal: controller.signal });
            clearTimeout(timeout);
            verified = res.ok || (res.status >= 300 && res.status < 500);
        } catch {
            verified = false;
        }
    }

    const emails = domain
        ? [`contato@${domain}`, `comercial@${domain}`, `atendimento@${domain}`]
        : [];

    return { domain, verified, emails };
}

export interface ScoreBreakdownItem {
    label: string;
    points: number;
    detail: string;
}

export interface FitScoreResult {
    score: number;
    temperature: 'Quente' | 'Morno' | 'Frio';
    breakdown: ScoreBreakdownItem[];
}

export interface FitScoreInput {
    situacaoCadastral?: string | null;
    capitalSocial?: number | null;
    employeeCountEstimate?: number | null;
    size?: string | null;
    cnaeDescription?: string | null;
    segmentKeywords?: string[];
    /** Cidade/UF real (pós-enriquecimento) — usado para o bônus de região de risco do playbook Atlas. */
    city?: string | null;
    state?: string | null;
    /** Faixa de frota selecionada no ICP (texto do dropdown) — usado para o bônus de frota do playbook Atlas. */
    fleetSizeHint?: string | null;
}

/** Score de fit determinístico e auditável — cada critério é real (dado da Receita) e explicado. */
export function computeFitScore(input: FitScoreInput): FitScoreResult {
    const breakdown: ScoreBreakdownItem[] = [];
    let score = 0;

    if (input.situacaoCadastral) {
        if (input.situacaoCadastral.toUpperCase() === 'ATIVA') {
            score += 30;
            breakdown.push({ label: 'Situação cadastral', points: 30, detail: 'CNPJ ativo na Receita Federal' });
        } else {
            score -= 40;
            breakdown.push({
                label: 'Situação cadastral',
                points: -40,
                detail: `CNPJ com situação "${input.situacaoCadastral}" — risco alto`,
            });
        }
    }

    if (input.capitalSocial != null) {
        if (input.capitalSocial >= 100000) {
            score += 20;
            breakdown.push({ label: 'Capital social', points: 20, detail: 'Capital social >= R$ 100 mil' });
        } else if (input.capitalSocial >= 10000) {
            score += 10;
            breakdown.push({ label: 'Capital social', points: 10, detail: 'Capital social entre R$ 10 mil e R$ 100 mil' });
        } else {
            breakdown.push({ label: 'Capital social', points: 0, detail: 'Capital social baixo (< R$ 10 mil)' });
        }
    }

    if (input.employeeCountEstimate != null) {
        if (input.employeeCountEstimate >= 50) {
            score += 20;
            breakdown.push({ label: 'Porte estimado', points: 20, detail: 'Estimativa de 50+ funcionários' });
        } else if (input.employeeCountEstimate >= 10) {
            score += 12;
            breakdown.push({ label: 'Porte estimado', points: 12, detail: 'Estimativa de 10-49 funcionários' });
        } else {
            score += 5;
            breakdown.push({ label: 'Porte estimado', points: 5, detail: 'Estimativa de 1-9 funcionários' });
        }
    }

    if (input.segmentKeywords?.length && input.cnaeDescription) {
        const desc = input.cnaeDescription.toLowerCase();
        const matched = input.segmentKeywords.some((k) => desc.includes(k.toLowerCase()));
        if (matched) {
            score += 25;
            breakdown.push({ label: 'Aderência de CNAE ao ICP', points: 25, detail: `Atividade "${input.cnaeDescription}" combina com o segmento buscado` });
        } else {
            breakdown.push({ label: 'Aderência de CNAE ao ICP', points: 0, detail: `Atividade "${input.cnaeDescription}" não confirma o segmento buscado` });
        }
    }

    // Critérios de priorização do playbook comercial Atlas: frota acima de 50 veículos
    // e atuação em regiões de maior índice de roubo de carga (RJ e Grande SP).
    if (input.fleetSizeHint && /acima de 50|150-500|acima de 500/i.test(input.fleetSizeHint)) {
        score += 15;
        breakdown.push({ label: 'Frota (playbook Atlas)', points: 15, detail: 'Frota acima de 50 veículos — critério de priorização' });
    }

    const riskRegion = `${input.city || ''} ${input.state || ''}`.toUpperCase();
    if (input.state && /^(RJ|SP)$/.test(input.state.toUpperCase())) {
        score += 10;
        breakdown.push({ label: 'Região de risco (playbook Atlas)', points: 10, detail: `Atuação em ${riskRegion.trim()} — região com maior índice de roubo de carga` });
    }

    score = Math.max(0, Math.min(100, score + 25)); // 25 pontos base de participação no funil

    const temperature: FitScoreResult['temperature'] = score >= 75 ? 'Quente' : score >= 45 ? 'Morno' : 'Frio';

    return { score, temperature, breakdown };
}

export interface EnrichCompanyOptions {
    cnpj?: string;
    segmentKeywords?: string[];
    fleetSizeHint?: string;
}

interface CompanyUpdateData {
    cnpj?: string;
    legalName?: string;
    tradeName?: string;
    situacaoCadastral?: string;
    naturezaJuridica?: string;
    capitalSocial?: number;
    dataAbertura?: Date;
    cnae?: string;
    size?: string;
    employeeCount?: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phones?: string[];
    emails?: string[];
    qsa?: Array<{ nome: string; qualificacao: string }>;
    website?: string;
    googleRating?: number;
    googleReviewsCount?: number;
    businessHours?: any;
    observations?: string;
}

/** Orquestra o enriquecimento completo de uma empresa já existente no CRM e grava o histórico. */
export async function enrichCompany(companyId: string, options: EnrichCompanyOptions = {}) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error('Company not found');

    await prisma.company.update({ where: { id: companyId }, data: { enrichmentStatus: 'Enriquecendo' } });

    try {
        return await runEnrichment(company, options);
    } catch (error) {
        await prisma.company.update({ where: { id: companyId }, data: { enrichmentStatus: 'Falhou' } }).catch(() => {});
        throw error;
    }
}

async function runEnrichment(
    company: NonNullable<Awaited<ReturnType<typeof prisma.company.findUnique>>>,
    options: EnrichCompanyOptions
) {
    const companyId = company.id;
    const cnpj = options.cnpj || company.cnpj;
    const updateData: CompanyUpdateData = {};
    let enrichmentSourceLabel = 'Heurística';

    if (cnpj && isValidCnpj(cnpj)) {
        const lookup = await fetchCnpjData(cnpj);

        await prisma.enrichmentLog.create({
            data: {
                companyId,
                source: 'BrasilAPI-CNPJ',
                field: 'dados-cadastrais',
                status: lookup.found ? 'success' : lookup.error === 'not_found' ? 'not_found' : 'failed',
                rawData: lookup.raw ? JSON.parse(JSON.stringify(lookup.raw)) : undefined,
            },
        });

        if (lookup.found && lookup.data) {
            enrichmentSourceLabel = 'BrasilAPI/Receita Federal';
            Object.assign(updateData, {
                cnpj: lookup.cnpj,
                legalName: lookup.data.legalName,
                tradeName: lookup.data.tradeName,
                situacaoCadastral: lookup.data.situacaoCadastral,
                naturezaJuridica: lookup.data.naturezaJuridica,
                capitalSocial: lookup.data.capitalSocial,
                dataAbertura: new Date(lookup.data.dataAbertura),
                cnae: lookup.data.cnae,
                size: lookup.data.size,
                employeeCount: lookup.data.employeeCountEstimate,
                address: lookup.data.address,
                city: lookup.data.city,
                state: lookup.data.state,
                zipCode: lookup.data.zipCode,
                phones: Array.from(new Set([...(company.phones || []), ...lookup.data.phones])),
                emails: Array.from(new Set([...(company.emails || []), ...lookup.data.emails])),
                qsa: lookup.data.qsa,
            } satisfies Partial<CompanyUpdateData>);
        }
    }

    const domainGuess = await guessDomainAndEmails(company.tradeName || company.legalName);
    await prisma.enrichmentLog.create({
        data: {
            companyId,
            source: 'Domain-Heuristic',
            field: 'website-e-emails',
            status: domainGuess.domain ? (domainGuess.verified ? 'success' : 'not_found') : 'failed',
            rawData: JSON.parse(JSON.stringify(domainGuess)),
        },
    });

    if (domainGuess.domain && !company.website) {
        updateData.website = domainGuess.verified
            ? `https://${domainGuess.domain}`
            : `https://${domainGuess.domain} (não verificado)`;
    }
    if (domainGuess.emails.length && !(company.emails || []).length && !updateData.emails) {
        updateData.emails = domainGuess.emails;
    }

    // Google Places API (Meu Negócio) Enrichment
    const locationQuery = updateData.city || company.city || '';
    const stateQuery = updateData.state || company.state || '';
    const place = await searchGooglePlace(updateData.tradeName || company.tradeName, `${locationQuery} ${stateQuery}`.trim());
    
    if (place) {
        updateData.googleRating = place.rating;
        updateData.googleReviewsCount = place.userRatingCount;
        updateData.businessHours = place.businessHours;
        
        if (place.websiteUri && !domainGuess.verified) {
            updateData.website = place.websiteUri;
        }
        if (place.nationalPhoneNumber) {
            updateData.phones = Array.from(new Set([...(updateData.phones || company.phones || []), place.nationalPhoneNumber]));
        }

        await prisma.enrichmentLog.create({
            data: {
                companyId,
                source: 'Google-Places',
                field: 'reputacao-local',
                status: 'success',
                rawData: JSON.parse(JSON.stringify(place)),
            }
        });
        enrichmentSourceLabel += ' + Google';
    }

    // Apollo People Enrichment
    let apolloContacts: any[] = [];
    if (domainGuess.verified && domainGuess.domain) {
        const apolloRes = await enrichOrganizationWithContacts(domainGuess.domain);
        if (apolloRes.contacts.length > 0) {
            apolloContacts = apolloRes.contacts;
            enrichmentSourceLabel += ' + Apollo';

            await prisma.enrichmentLog.create({
                data: {
                    companyId,
                    source: 'Apollo-People',
                    field: 'contatos-decisores',
                    status: 'success',
                    rawData: JSON.parse(JSON.stringify(apolloContacts)),
                }
            });
            
            // Save contacts to CRM
            for (const c of apolloContacts) {
                if (!c.name || c.name === 'Sem Nome') continue;
                await prisma.contact.create({
                    data: {
                        name: c.name,
                        role: c.title,
                        email: c.email,
                        phone: c.phone,
                        linkedin: c.linkedin_url,
                        source: 'Apollo',
                        companyId,
                        organizationId: company.organizationId
                    }
                });
            }
        }
    }

    const fit = computeFitScore({
        situacaoCadastral: updateData.situacaoCadastral ?? company.situacaoCadastral,
        capitalSocial: updateData.capitalSocial ?? company.capitalSocial,
        employeeCountEstimate: updateData.employeeCount ?? company.employeeCount,
        cnaeDescription: undefined,
        segmentKeywords: options.segmentKeywords,
        city: updateData.city ?? company.city,
        state: updateData.state ?? company.state,
        fleetSizeHint: options.fleetSizeHint,
    });

    // Resumo determinístico do enriquecimento — montado a partir dos próprios dados coletados
    // acima (Receita Federal, Google Negócios, Apollo), sem depender de nenhum modelo generativo.
    const summaryParts: string[] = [];
    if (updateData.situacaoCadastral) {
        summaryParts.push(
            updateData.situacaoCadastral.toUpperCase() === 'ATIVA'
                ? 'CNPJ ativo na Receita Federal'
                : `CNPJ com situação "${updateData.situacaoCadastral}" — atenção antes de abordar`
        );
    }
    if (updateData.googleRating != null) {
        summaryParts.push(`nota ${updateData.googleRating} no Google (${updateData.googleReviewsCount || 0} avaliações)`);
    }
    if (apolloContacts.length > 0) {
        summaryParts.push(`decisores identificados via Apollo: ${apolloContacts.map((c) => `${c.name} (${c.title || 'cargo não informado'})`).join(', ')}`);
    }
    if (summaryParts.length > 0) {
        updateData.observations = `Resumo do enriquecimento — ${summaryParts.join('; ')}.`;
    }

    const updated = await prisma.company.update({
        where: { id: companyId },
        data: {
            ...updateData,
            enrichmentStatus: 'Enriquecido',
            enrichmentSource: enrichmentSourceLabel,
            enrichedAt: new Date(),
        },
    });

    return { company: { ...updated, status: fromPrismaCompanyStatus(updated.status) }, fit, domainGuess, apolloContacts };
}
