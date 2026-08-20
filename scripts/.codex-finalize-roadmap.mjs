import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, content) => {
  const full = path.join(root, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
};
const replaceOnce = (file, from, to) => {
  const current = read(file);
  if (!current.includes(from)) throw new Error(`Patch anchor not found in ${file}: ${from.slice(0, 120)}`);
  write(file, current.replace(from, to));
};
const appendOnce = (file, marker, block) => {
  const current = read(file);
  if (!current.includes(marker)) write(file, `${current.trimEnd()}\n\n${block.trim()}\n`);
};

// DATA-006: calendário comercial único, explicitamente America/Sao_Paulo (UTC-03 desde 2019).
write('src/shared/time/brazilCalendar.ts', `/** Calendário canônico da operação AtlasGR/TotalTrac (America/Sao_Paulo). */
export const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';
export const BRAZIL_UTC_OFFSET_MS = 3 * 60 * 60 * 1000;

export function brazilDateParts(date: Date): { year: number; month: number; day: number } {
    const shifted = new Date(date.getTime() - BRAZIL_UTC_OFFSET_MS);
    return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate() };
}

export function brazilMidnightUtc(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day, 3, 0, 0, 0));
}

export function brazilEndOfDayUtc(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day, 26, 59, 59, 999));
}

export function brazilMonthKey(date: Date): string {
    const { year, month } = brazilDateParts(date);
    return \`${'${year}'}-\${String(month + 1).padStart(2, '0')}\`;
}

export function brazilMonthRange(period: string): { start: Date; end: Date; daysInMonth: number } {
    const match = /^(\\d{4})-(0[1-9]|1[0-2])$/.exec(period);
    if (!match) throw new Error(\`Período mensal inválido: \${period}\`);
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const start = brazilMidnightUtc(year, month, 1);
    const end = brazilMidnightUtc(year, month + 1, 1);
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return { start, end, daysInMonth };
}

export function shiftBrazilMonth(period: string, offset: number): string {
    const match = /^(\\d{4})-(0[1-9]|1[0-2])$/.exec(period);
    if (!match) throw new Error(\`Período mensal inválido: \${period}\`);
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1 + offset, 1));
    return \`${'${date.getUTCFullYear()}'}-\${String(date.getUTCMonth() + 1).padStart(2, '0')}\`;
}
`);

replaceOnce('src/features/integrations/bitrix/service/extractionPeriod.ts',
`/**\n * Resolução de período para o serviço real de Extrações Bitrix`,
`import { brazilDateParts, brazilMidnightUtc, brazilEndOfDayUtc } from '../../../../shared/time/brazilCalendar.js';\n\n/**\n * Resolução de período para o serviço real de Extrações Bitrix`);
replaceOnce('src/features/integrations/bitrix/service/extractionPeriod.ts',
`const BR_OFFSET_MS = 3 * 60 * 60 * 1000; // America/Sao_Paulo = UTC-03:00 (fixo)\n\n/** Componentes de calendário (ano/mês/dia) do horário de Brasília correspondente a um instante UTC. */\nfunction brazilDateParts(date: Date): { year: number; month: number; day: number } {\n    const shifted = new Date(date.getTime() - BR_OFFSET_MS);\n    return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate() };\n}\n\n/** 00:00:00 do dia informado, horário de Brasília, devolvido como instante UTC real. */\nfunction brazilMidnightUtc(year: number, month: number, day: number): Date {\n    return new Date(Date.UTC(year, month, day, 3, 0, 0, 0));\n}\n\n/** 23:59:59.999 do dia informado, horário de Brasília, devolvido como instante UTC real. */\nfunction brazilEndOfDayUtc(year: number, month: number, day: number): Date {\n    return new Date(Date.UTC(year, month, day, 26, 59, 59, 999));\n}\n\n`, ``);

replaceOnce('src/features/commercial-intelligence/application/CommercialIntelligenceUseCases.ts',
`import { shiftMonth, monthLabelPt, countBusinessDays } from './executiveCalendar';`,
`import { shiftMonth, monthLabelPt, countBusinessDays } from './executiveCalendar';\nimport { brazilMonthKey, brazilMonthRange } from '../../../shared/time/brazilCalendar.js';`);
replaceOnce('src/features/commercial-intelligence/application/CommercialIntelligenceUseCases.ts',
`function monthRange(period: string): { start: Date; end: Date; daysInMonth: number } {\n    const [year, month] = period.split('-').map(Number);\n    const start = new Date(Date.UTC(year, month - 1, 1));\n    const end = new Date(Date.UTC(year, month, 1));\n    const daysInMonth = Math.round((end.getTime() - start.getTime()) / DAY_MS);\n    return { start, end, daysInMonth };\n}\n\nexport function currentPeriod(now = new Date()): string {\n    return \`${'${now.getUTCFullYear()}'}-\${String(now.getUTCMonth() + 1).padStart(2, '0')}\`;\n}`,
`function monthRange(period: string): { start: Date; end: Date; daysInMonth: number } {\n    return brazilMonthRange(period);\n}\n\nexport function currentPeriod(now = new Date()): string {\n    return brazilMonthKey(now);\n}`);

replaceOnce('src/features/analytics/analytics.service.ts',
`import type { OverviewMetrics } from '../../shared/contracts/analytics.contract.js';`,
`import type { OverviewMetrics } from '../../shared/contracts/analytics.contract.js';\nimport { brazilMonthKey, brazilMonthRange, shiftBrazilMonth } from '../../shared/time/brazilCalendar.js';`);
replaceOnce('src/features/analytics/analytics.service.ts',
`function startOfCurrentMonth(now: Date): Date {\n    const d = new Date(now);\n    d.setDate(1);\n    d.setHours(0, 0, 0, 0);\n    return d;\n}\n\n/** Primeiro dia do mês, \`monthsBack\` meses atrás. */\nfunction startOfMonthsAgo(now: Date, monthsBack: number): Date {\n    const d = startOfCurrentMonth(now);\n    d.setMonth(d.getMonth() - monthsBack);\n    return d;\n}\n\nfunction monthKey(date: Date): string {\n    return \`${'${date.getFullYear()}'}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;\n}`,
`function startOfCurrentMonth(now: Date): Date {\n    return brazilMonthRange(brazilMonthKey(now)).start;\n}\n\n/** Primeiro dia do mês, \`monthsBack\` meses atrás, sempre no calendário de Brasília. */\nfunction startOfMonthsAgo(now: Date, monthsBack: number): Date {\n    return brazilMonthRange(shiftBrazilMonth(brazilMonthKey(now), -monthsBack)).start;\n}\n\nfunction monthKey(date: Date): string {\n    return brazilMonthKey(date);\n}`);

// DATA-007: remove a segunda implementação client-side do previsor e usa a implementação pura canônica.
replaceOnce('src/features/commercial-intelligence/commercialIntelligence.api.ts',
`import { api } from '../../lib/api';`,
`import { api } from '../../lib/api';\nimport { brazilMonthKey } from '../../shared/time/brazilCalendar';`);
const apiFile = read('src/features/commercial-intelligence/commercialIntelligence.api.ts');
const predictorMarker = `/**\n * Previsor — Faixa de Cenário. Espelha \`application/predictiveForecast.ts\``;
const markerIndex = apiFile.indexOf(predictorMarker);
if (markerIndex < 0) throw new Error('Predictive duplicate marker not found');
write('src/features/commercial-intelligence/commercialIntelligence.api.ts', apiFile.slice(0, markerIndex) + `/** DATA-007: implementação única e pura, compartilhada por backend e frontend. */\nexport { buildForecastRange, computeTrendMomentum, TREND_MOMENTUM_THRESHOLD_PP } from './application/predictiveForecast';\n\nexport function currentMonth(): string {\n    return brazilMonthKey(new Date());\n}\n`);

// DATA-008: OpenAPI passa a espelhar todos os status e campos realmente aceitos por leadSchema.
replaceOnce('docs/openapi.yaml',
`        - Call/Visita Agendada\n        - Negócios Perdidos\n        - Negócios Ganhos`,
`        - Call/Visita Agendada\n        - Piloto VTECH\n        - Piloto Atlas Profile\n        - Piloto Atlas Profile - Concluído\n        - Piloto Atlas Profile - Cancelado\n        - Piloto Logística\n        - Piloto Logístico - Concluído\n        - Piloto Logístico - Cancelado\n        - Negócios Perdidos\n        - Negócios Ganhos`);
replaceOnce('docs/openapi.yaml',
`        contactId: { type: string, nullable: true }\n        pic:`,
`        contactId: { type: string, nullable: true }\n        funnel: { type: string, enum: [Lead, Negocio] }\n        title: { type: string, maxLength: 180, nullable: true }\n        amount: { type: number, minimum: 0, nullable: true }\n        currency: { type: string, minLength: 3, maxLength: 3 }\n        probability: { type: integer, minimum: 0, maximum: 100, nullable: true }\n        expectedCloseAt: { type: string, nullable: true }\n        pipelineId: { type: string, nullable: true }\n        pipelineStageId: { type: string, nullable: true }\n        customFields: { type: object, nullable: true, additionalProperties: true }\n        pic:`);

write('tests/unit/shared/time/brazilCalendar.test.ts', `import { describe, expect, it } from 'vitest';
import { brazilEndOfDayUtc, brazilMonthKey, brazilMonthRange, shiftBrazilMonth } from '../../../../src/shared/time/brazilCalendar.js';

describe('brazilCalendar', () => {
    it('mantém 23:30 de Brasília no mês brasileiro, mesmo já sendo o mês seguinte em UTC', () => {
        expect(brazilMonthKey(new Date('2026-09-01T02:30:00.000Z'))).toBe('2026-08');
    });

    it('cria fronteiras mensais em 00:00 BRT, não 00:00 UTC', () => {
        const range = brazilMonthRange('2026-08');
        expect(range.start.toISOString()).toBe('2026-08-01T03:00:00.000Z');
        expect(range.end.toISOString()).toBe('2026-09-01T03:00:00.000Z');
        expect(range.daysInMonth).toBe(31);
    });

    it('atravessa ano e preserva fim inclusivo de dia em Brasília', () => {
        expect(shiftBrazilMonth('2026-01', -1)).toBe('2025-12');
        expect(brazilEndOfDayUtc(2026, 7, 20).toISOString()).toBe('2026-08-21T02:59:59.999Z');
    });
});
`);

write('tests/unit/shared/contracts/lead-openapi-contract.test.ts', `import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { LEAD_STATUS, leadSchema } from '../../../../src/lib/zod.js';

const document = parse(readFileSync('docs/openapi.yaml', 'utf8')) as any;
const schemas = document.components.schemas;

describe('DATA-008 — contrato OpenAPI de Lead', () => {
    it('mantém o enum LeadStatus exatamente igual ao enum aceito pelo backend', () => {
        expect(schemas.LeadStatus.enum).toEqual([...LEAD_STATUS]);
    });

    it('documenta exatamente os campos aceitos por leadSchema', () => {
        expect(Object.keys(schemas.LeadInput.properties).sort()).toEqual(Object.keys(leadSchema.shape).sort());
    });

    it('preserva restrições dos campos comerciais críticos', () => {
        expect(schemas.LeadInput.properties.funnel.enum).toEqual(['Lead', 'Negocio']);
        expect(schemas.LeadInput.properties.amount.minimum).toBe(0);
        expect(schemas.LeadInput.properties.probability).toMatchObject({ type: 'integer', minimum: 0, maximum: 100, nullable: true });
        expect(schemas.LeadInput.properties.title.maxLength).toBe(180);
    });
});
`);

// Golden Dataset: corrige expectativa incoerente com o threshold real do graph (QUALIFIED >= 70).
replaceOnce('src/features/intelligence/evaluation/golden-dataset.json', `"version": "2026-08-20.1"`, `"version": "2026-08-20.2"`);
replaceOnce('src/features/intelligence/evaluation/golden-dataset.json',
`"expected": { "status": "QUALIFIED", "minScore": 55, "maxScore": 90 }`,
`"expected": { "status": "QUALIFIED", "minScore": 70, "maxScore": 90 }`);
replaceOnce('src/features/intelligence/evaluation/goldenDataset.types.ts',
` * Deliberadamente NÃO inclui um harness de scoring automático (LLM-judge, threshold, gate de CI):\n * decidir a metodologia de avaliação (comparação exata? similaridade semântica? juiz por LLM?) é\n * decisão de produto que este dataset não tenta resolver sozinho — ver nota de escopo no audit doc.\n * O que este arquivo garante é que cada caso é ESTRUTURALMENTE válido: os campos \`expected\` usam os`,
` * O scoring automático vive em \`goldenDataset.scoring.ts\`: checks determinísticos por categoria,\n * thresholds por caso/categoria/geral e um SemanticJudge opcional para factualidade, aderência ao\n * playbook e risco de alucinação. O gate determinístico roda sempre no CI; o live runner usa as\n * capacidades reais e pode acoplar o LLM judge quando um provedor de IA está configurado.\n * Este arquivo continua garantindo que cada caso é ESTRUTURALMENTE válido: os campos \`expected\` usam os`);

write('src/features/intelligence/evaluation/goldenDataset.scoring.ts', `import { loadGoldenDataset } from './goldenDataset.service.js';
import type { GoldenCase, GoldenCaseCategory } from './goldenDataset.types.js';

export interface SemanticJudgeResult {
    semanticScore: number;
    factualityScore: number;
    playbookAdherenceScore: number;
    hallucinationRisk: number;
    rationale?: string;
}

export interface GoldenSemanticJudge {
    judge(input: { goldenCase: GoldenCase; actual: unknown }): Promise<SemanticJudgeResult>;
}

export interface GoldenEvaluationThresholds {
    caseMinimum: number;
    categoryMinimum: number;
    overallMinimum: number;
    maxHallucinationRisk: number;
}

export const DEFAULT_GOLDEN_THRESHOLDS: GoldenEvaluationThresholds = {
    caseMinimum: 0.55,
    categoryMinimum: 0.70,
    overallMinimum: 0.78,
    maxHallucinationRisk: 0.35,
};

export interface GoldenCaseEvaluation {
    caseId: string;
    category: GoldenCaseCategory;
    deterministicScore: number;
    judge?: SemanticJudgeResult;
    finalScore: number;
    passed: boolean;
    reasons: string[];
}

export interface GoldenDatasetEvaluation {
    version: string;
    overallScore: number;
    categoryScores: Record<GoldenCaseCategory, number>;
    cases: GoldenCaseEvaluation[];
    passed: boolean;
    thresholds: GoldenEvaluationThresholds;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const normalize = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
const tokens = (value: unknown) => new Set(normalize(value).match(/[a-z0-9]{3,}/g) ?? []);

function jaccard(a: unknown, b: unknown): number {
    const left = tokens(a); const right = tokens(b);
    if (left.size === 0 && right.size === 0) return 1;
    const intersection = [...left].filter((token) => right.has(token)).length;
    const union = new Set([...left, ...right]).size;
    return union === 0 ? 0 : intersection / union;
}

function textOf(actual: unknown): string {
    if (typeof actual === 'string') return actual;
    if (actual && typeof actual === 'object') {
        const obj = actual as Record<string, unknown>;
        return String(obj.text ?? obj.content ?? obj.answer ?? obj.directAnswer ?? obj.personaReply ?? obj.executiveSummary ?? '');
    }
    return '';
}

function deepSubset(expected: unknown, actual: unknown): number {
    if (expected === null || typeof expected !== 'object') return Object.is(expected, actual) ? 1 : 0;
    if (Array.isArray(expected)) {
        if (!Array.isArray(actual) || expected.length === 0) return expected.length === 0 && Array.isArray(actual) ? 1 : 0;
        const matched = expected.filter((item) => actual.some((candidate) => deepSubset(item, candidate) === 1)).length;
        return matched / expected.length;
    }
    if (!actual || typeof actual !== 'object') return 0;
    const entries = Object.entries(expected as Record<string, unknown>);
    if (entries.length === 0) return 1;
    return entries.reduce((sum, [key, value]) => sum + deepSubset(value, (actual as Record<string, unknown>)[key]), 0) / entries.length;
}

function deterministicScore(goldenCase: GoldenCase, actual: unknown): { score: number; reasons: string[] } {
    const obj = (actual && typeof actual === 'object' ? actual : {}) as Record<string, any>;
    const reasons: string[] = [];
    switch (goldenCase.category) {
        case 'lead_qualification': {
            const score = Number(obj.qualificationScore ?? obj.score);
            const statusOk = obj.status === goldenCase.expected.status;
            const rangeOk = Number.isFinite(score) && score >= goldenCase.expected.minScore && score <= goldenCase.expected.maxScore;
            if (!statusOk) reasons.push(\`status esperado \${goldenCase.expected.status}\`);
            if (!rangeOk) reasons.push(\`score fora de \${goldenCase.expected.minScore}-\${goldenCase.expected.maxScore}\`);
            return { score: (Number(statusOk) + Number(rangeOk)) / 2, reasons };
        }
        case 'cold_email': {
            const text = normalize(textOf(actual));
            const keywordCoverage = goldenCase.expected.mustMentionKeywords.filter((k) => text.includes(normalize(k))).length / goldenCase.expected.mustMentionKeywords.length;
            const similarity = jaccard(text, goldenCase.expected.referenceAnswer);
            if (keywordCoverage < 1) reasons.push('palavras-chave obrigatórias ausentes');
            return { score: clamp01(keywordCoverage * 0.7 + similarity * 0.3), reasons };
        }
        case 'objection_handling': {
            const text = normalize(textOf(actual));
            const strategyCoverage = goldenCase.expected.mustAddressStrategies.filter((s) => text.includes(normalize(s))).length / goldenCase.expected.mustAddressStrategies.length;
            const similarity = jaccard(text, goldenCase.expected.referenceAnswer);
            if (strategyCoverage < 1) reasons.push('estratégias obrigatórias ausentes');
            return { score: clamp01(strategyCoverage * 0.75 + similarity * 0.25), reasons };
        }
        case 'roleplay': {
            const interest = Number(obj.currentLeadInterest ?? obj.interest);
            const interestOk = Number.isFinite(interest) && interest >= goldenCase.expected.minInterest && interest <= goldenCase.expected.maxInterest;
            const closedOk = Boolean(obj.isDealClosed ?? obj.dealClosed) === goldenCase.expected.dealClosed;
            const lostOk = Boolean(obj.isDealLost ?? obj.dealLost) === goldenCase.expected.dealLost;
            return { score: (Number(interestOk) * 0.5) + (Number(closedOk) * 0.25) + (Number(lostOk) * 0.25), reasons };
        }
        case 'next_best_action': {
            const actionOk = obj.actionType === goldenCase.expected.actionType;
            const priorityOk = goldenCase.expected.priorityOneOf.includes(obj.priority);
            if (!actionOk) reasons.push('actionType divergente');
            if (!priorityOk) reasons.push('priority fora do conjunto aceito');
            return { score: Number(actionOk) * 0.7 + Number(priorityOk) * 0.3, reasons };
        }
        case 'summary': {
            const sentimentOk = goldenCase.expected.sentimentOneOf.includes(obj.sentimentScore ?? obj.sentiment);
            const actionCount = Array.isArray(obj.actionItems) ? obj.actionItems.length : 0;
            const actionsOk = actionCount >= goldenCase.expected.minActionItems;
            if (!sentimentOk) reasons.push('sentimento divergente');
            if (!actionsOk) reasons.push('actionItems insuficientes');
            return { score: Number(sentimentOk) * 0.6 + Number(actionsOk) * 0.4, reasons };
        }
        case 'rag': {
            const actualIds: string[] = Array.isArray(obj.citedChunkIds)
                ? obj.citedChunkIds
                : Array.isArray(obj.sourceReferences) ? obj.sourceReferences.map((r: any) => r?.chunkId).filter(Boolean) : [];
            const expected = new Set(goldenCase.expected.expectedCitedChunkIds);
            const actualSet = new Set(actualIds);
            if (expected.size === 0) return { score: actualSet.size === 0 ? 1 : 0, reasons: actualSet.size ? ['citação não esperada'] : [] };
            const tp = [...expected].filter((id) => actualSet.has(id)).length;
            const precision = actualSet.size ? tp / actualSet.size : 0;
            const recall = tp / expected.size;
            const f1 = precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall);
            return { score: f1, reasons: f1 < 1 ? ['citações divergentes'] : [] };
        }
        case 'tool_use': {
            const tool = obj.tool ?? obj.toolName ?? obj.name;
            const args = obj.args ?? obj.arguments ?? {};
            const toolOk = tool === goldenCase.expected.expectedTool;
            const argsScore = deepSubset(goldenCase.expected.expectedArgs, args);
            if (!toolOk) reasons.push('ferramenta selecionada divergente');
            if (argsScore < 1) reasons.push('argumentos divergentes');
            return { score: Number(toolOk) * 0.7 + argsScore * 0.3, reasons };
        }
    }
}

export async function scoreGoldenCase(goldenCase: GoldenCase, actual: unknown, judge?: GoldenSemanticJudge, thresholds = DEFAULT_GOLDEN_THRESHOLDS): Promise<GoldenCaseEvaluation> {
    const deterministic = deterministicScore(goldenCase, actual);
    let semantic: SemanticJudgeResult | undefined;
    if (judge && ['cold_email', 'objection_handling', 'summary', 'rag'].includes(goldenCase.category)) semantic = await judge.judge({ goldenCase, actual });
    const judgeQuality = semantic ? (clamp01(semantic.semanticScore) + clamp01(semantic.factualityScore) + clamp01(semantic.playbookAdherenceScore) + (1 - clamp01(semantic.hallucinationRisk))) / 4 : null;
    const finalScore = clamp01(judgeQuality == null ? deterministic.score : deterministic.score * 0.6 + judgeQuality * 0.4);
    const hallucinationOk = !semantic || semantic.hallucinationRisk <= thresholds.maxHallucinationRisk;
    const reasons = [...deterministic.reasons];
    if (!hallucinationOk) reasons.push('risco de alucinação acima do limite');
    return { caseId: goldenCase.id, category: goldenCase.category, deterministicScore: deterministic.score, judge: semantic, finalScore, passed: finalScore >= thresholds.caseMinimum && hallucinationOk, reasons };
}

export async function evaluateGoldenDataset(observedByCaseId: Record<string, unknown>, options: { judge?: GoldenSemanticJudge; thresholds?: Partial<GoldenEvaluationThresholds> } = {}): Promise<GoldenDatasetEvaluation> {
    const dataset = loadGoldenDataset();
    const thresholds = { ...DEFAULT_GOLDEN_THRESHOLDS, ...options.thresholds };
    const cases: GoldenCaseEvaluation[] = [];
    for (const goldenCase of dataset.cases) cases.push(await scoreGoldenCase(goldenCase, observedByCaseId[goldenCase.id], options.judge, thresholds));
    const categoryScores = Object.fromEntries([...new Set(dataset.cases.map((c) => c.category))].map((category) => {
        const rows = cases.filter((c) => c.category === category);
        return [category, rows.reduce((sum, row) => sum + row.finalScore, 0) / rows.length];
    })) as Record<GoldenCaseCategory, number>;
    const overallScore = cases.reduce((sum, row) => sum + row.finalScore, 0) / cases.length;
    const passed = overallScore >= thresholds.overallMinimum && Object.values(categoryScores).every((score) => score >= thresholds.categoryMinimum) && cases.every((row) => row.passed);
    return { version: dataset.version, overallScore, categoryScores, cases, passed, thresholds };
}
`);

write('src/features/intelligence/evaluation/goldenDataset.llmJudge.ts', `import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { cleanAndParseJson, getAiModel } from '../../../lib/ai/gateway.js';
import type { GoldenSemanticJudge, SemanticJudgeResult } from './goldenDataset.scoring.js';

const clamp01 = (value: unknown) => Math.max(0, Math.min(1, Number(value) || 0));

export class GatewayGoldenSemanticJudge implements GoldenSemanticJudge {
    async judge({ goldenCase, actual }: Parameters<GoldenSemanticJudge['judge']>[0]): Promise<SemanticJudgeResult> {
        const model = getAiModel('local-llama3-fast', 0, 'golden-dataset-judge');
        const response = await model.invoke([
            new SystemMessage(`Você é um juiz de regressão de IA. Avalie SOMENTE contra o caso ouro fornecido. Não recompense eloquência. Dê notas de 0 a 1 para: semanticScore (atende a intenção/expected), factualityScore (não contradiz input), playbookAdherenceScore (segue expected/regras), hallucinationRisk (1 = inventou fatos não sustentados). Responda apenas JSON: {"semanticScore":0,"factualityScore":0,"playbookAdherenceScore":0,"hallucinationRisk":0,"rationale":"curto"}.`),
            new HumanMessage(JSON.stringify({ input: goldenCase.input, expected: goldenCase.expected, actual })),
        ]);
        const raw = cleanAndParseJson<Record<string, unknown>>(response.content);
        return { semanticScore: clamp01(raw.semanticScore), factualityScore: clamp01(raw.factualityScore), playbookAdherenceScore: clamp01(raw.playbookAdherenceScore), hallucinationRisk: clamp01(raw.hallucinationRisk), rationale: String(raw.rationale ?? '') };
    }
}
`);

write('src/features/intelligence/evaluation/goldenDataset.runner.ts', `import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { cleanAndParseJson, getAiModel } from '../../../lib/ai/gateway.js';
import { generateEmailDraft, generateObjectionHandling } from '../../../lib/ai/features.js';
import { compileLeadGraph } from '../graphs/leadQualification.js';
import { RoleplayAiService } from '../../roleplay/services/roleplay-ai.service.js';
import { NextBestActionService } from '../../activities/services/next-best-action.service.js';
import { MeetingSynthesisService } from '../../chatbook/services/meeting-synthesis.service.js';
import { KnowledgeCopilotService } from '../../knowledge/services/knowledge-copilot.service.js';
import { GOLDEN_TOOL_NAMES, type GoldenCase } from './goldenDataset.types.js';

const roleplay = new RoleplayAiService();
const nextBestAction = new NextBestActionService();
const meeting = new MeetingSynthesisService();
const knowledge = new KnowledgeCopilotService();

export async function runGoldenCaseAgainstProduction(goldenCase: GoldenCase): Promise<unknown> {
    switch (goldenCase.category) {
        case 'lead_qualification': return compileLeadGraph().invoke(goldenCase.input);
        case 'cold_email': return generateEmailDraft(goldenCase.input.context, goldenCase.input.goal);
        case 'objection_handling': return generateObjectionHandling(goldenCase.input.objection);
        case 'roleplay': return roleplay.simulateCustomerResponse(goldenCase.input);
        case 'next_best_action': return nextBestAction.determineNextAction(goldenCase.input);
        case 'summary': return meeting.synthesizeMeeting(goldenCase.input);
        case 'rag': return knowledge.answerTechnicalQuestion(goldenCase.input);
        case 'tool_use': {
            const model = getAiModel('local-llama3-fast', 0, 'golden-tool-router');
            const response = await model.invoke([
                new SystemMessage(\`Selecione exatamente uma ferramenta para o cenário. Ferramentas disponíveis: \${GOLDEN_TOOL_NAMES.join(', ')}. Responda apenas JSON {"tool":"nome_exato","args":{}}. Não execute a ferramenta.\`),
                new HumanMessage(goldenCase.input.scenario),
            ]);
            const parsed = cleanAndParseJson<{ tool: string; args: Record<string, unknown> }>(response.content);
            return parsed;
        }
    }
}
`);

write('scripts/evaluate-golden-dataset-live.ts', `import { loadGoldenDataset, validateToolUseCases } from '../src/features/intelligence/evaluation/goldenDataset.service.js';
import { evaluateGoldenDataset } from '../src/features/intelligence/evaluation/goldenDataset.scoring.js';
import { GatewayGoldenSemanticJudge } from '../src/features/intelligence/evaluation/goldenDataset.llmJudge.js';
import { runGoldenCaseAgainstProduction } from '../src/features/intelligence/evaluation/goldenDataset.runner.js';

const dataset = loadGoldenDataset();
const toolSchemas = await validateToolUseCases();
const invalidToolFixture = toolSchemas.find((row) => !row.valid);
if (invalidToolFixture) throw new Error(\`Golden tool fixture inválido: \${invalidToolFixture.caseId}: \${invalidToolFixture.error}\`);

const observed: Record<string, unknown> = {};
for (const goldenCase of dataset.cases) {
    console.log(\`▶ \${goldenCase.id}\`);
    observed[goldenCase.id] = await runGoldenCaseAgainstProduction(goldenCase);
}
const useJudge = process.env.GOLDEN_EVAL_USE_LLM_JUDGE !== 'false';
const report = await evaluateGoldenDataset(observed, { judge: useJudge ? new GatewayGoldenSemanticJudge() : undefined });
console.table(report.cases.map((row) => ({ case: row.caseId, category: row.category, score: row.finalScore.toFixed(3), passed: row.passed, reasons: row.reasons.join('; ') })));
console.log('Category scores:', Object.fromEntries(Object.entries(report.categoryScores).map(([k, v]) => [k, v.toFixed(3)])));
console.log(\`Overall: \${report.overallScore.toFixed(3)} | threshold \${report.thresholds.overallMinimum} | \${report.passed ? 'PASS' : 'FAIL'}\`);
if (!report.passed) process.exitCode = 1;
`);

write('src/features/intelligence/evaluation/__tests__/goldenDataset.scoring.test.ts', `import { describe, expect, it } from 'vitest';
import { loadGoldenDataset } from '../goldenDataset.service.js';
import { evaluateGoldenDataset, scoreGoldenCase } from '../goldenDataset.scoring.js';

function idealOutput(goldenCase: any): unknown {
    switch (goldenCase.category) {
        case 'lead_qualification': return { status: goldenCase.expected.status, qualificationScore: Math.ceil((goldenCase.expected.minScore + goldenCase.expected.maxScore) / 2) };
        case 'cold_email': case 'objection_handling': return goldenCase.expected.referenceAnswer;
        case 'roleplay': return { currentLeadInterest: (goldenCase.expected.minInterest + goldenCase.expected.maxInterest) / 2, isDealClosed: goldenCase.expected.dealClosed, isDealLost: goldenCase.expected.dealLost };
        case 'next_best_action': return { actionType: goldenCase.expected.actionType, priority: goldenCase.expected.priorityOneOf[0] };
        case 'summary': return { sentimentScore: goldenCase.expected.sentimentOneOf[0], actionItems: Array.from({ length: goldenCase.expected.minActionItems }, () => ({})) };
        case 'rag': return { sourceReferences: goldenCase.expected.expectedCitedChunkIds.map((chunkId: string) => ({ chunkId })) };
        case 'tool_use': return { tool: goldenCase.expected.expectedTool, args: goldenCase.expected.expectedArgs };
    }
}

describe('Golden Dataset automatic scoring gate', () => {
    it('pontua todos os 24 casos e aprova uma baseline aderente', async () => {
        const dataset = loadGoldenDataset();
        const outputs = Object.fromEntries(dataset.cases.map((goldenCase) => [goldenCase.id, idealOutput(goldenCase)]));
        const report = await evaluateGoldenDataset(outputs);
        expect(report.cases).toHaveLength(24);
        expect(report.passed).toBe(true);
        expect(report.overallScore).toBeGreaterThanOrEqual(report.thresholds.overallMinimum);
    });

    it('falha fechado quando resultados estão ausentes', async () => {
        const report = await evaluateGoldenDataset({});
        expect(report.passed).toBe(false);
        expect(report.cases.some((row) => !row.passed)).toBe(true);
    });

    it('usa juiz semântico e bloqueia risco alto de alucinação', async () => {
        const goldenCase = loadGoldenDataset().cases.find((row) => row.category === 'cold_email')!;
        const result = await scoreGoldenCase(goldenCase, idealOutput(goldenCase), { judge: async () => ({ semanticScore: 1, factualityScore: 1, playbookAdherenceScore: 1, hallucinationRisk: 0.9 }) });
        expect(result.passed).toBe(false);
        expect(result.reasons).toContain('risco de alucinação acima do limite');
    });

    it('mantém casos QUALIFIED coerentes com o threshold real do graph (>=70)', () => {
        const qualified = loadGoldenDataset().cases.filter((row: any) => row.category === 'lead_qualification' && row.expected.status === 'QUALIFIED') as any[];
        expect(qualified.every((row) => row.expected.minScore >= 70)).toBe(true);
    });
});
`);

// Script público para avaliação live; o teste determinístico acima já integra o gate unitário existente.
replaceOnce('package.json',
`    "verify:ai": "tsx scripts/verify-ai-studio.ts",`,
`    "verify:ai": "tsx scripts/verify-ai-studio.ts",\n    "eval:golden": "tsx scripts/evaluate-golden-dataset-live.ts",`);

// Se houver provedor configurado no repositório, a mesma job protegida passa a executar avaliação live + LLM judge.
replaceOnce('.github/workflows/ci.yml',
`      PLATFORM_OPERATOR_TOKEN: ci-test-operator-token-not-for-production\n\n    steps:`,
`      PLATFORM_OPERATOR_TOKEN: ci-test-operator-token-not-for-production\n      GROQ_API_KEY: \${{ secrets.GROQ_API_KEY }}\n      OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}\n\n    steps:`);
replaceOnce('.github/workflows/ci.yml',
`      - name: Run Unit Tests\n        run: npm run test:unit -- --coverage\n\n      - name: Run Migrations`,
`      - name: Run Unit Tests\n        run: npm run test:unit -- --coverage\n\n      # AI-005/006 fechamento: o scorer/threshold é sempre exercitado pelos unit tests acima.\n      # Quando um provedor real está configurado, roda também as 24 capacidades reais + LLM judge;\n      # qualquer regressão abaixo dos thresholds falha esta mesma job protegida.\n      - name: Golden Dataset live regression gate\n        if: \${{ env.GROQ_API_KEY != '' || env.OPENAI_API_KEY != '' }}\n        env:\n          GOLDEN_EVAL_USE_LLM_JUDGE: 'true'\n        run: npm run eval:golden\n\n      - name: Run Migrations`);

appendOnce('docs/DATA-CONTRACT-LEAD.md', 'Fechamento DATA-006/007/008 — 2026-08-20', `## Fechamento DATA-006/007/008 — 2026-08-20

- **DATA-006 — fechado:** fronteiras mensais e mês corrente agora usam um calendário canônico de Brasília em backend, Analytics legado, Comercial Inteligente, frontend e extrações Bitrix. O caso crítico 31/08 23:30 BRT (01/09 UTC) tem regressão automatizada.
- **DATA-007 — fechado:** a segunda implementação client-side de \`buildForecastRange\` / \`computeTrendMomentum\` foi removida; frontend e backend reutilizam o mesmo módulo puro.
- **DATA-008 — fechado:** \`LeadStatus\` e \`LeadInput\` no OpenAPI espelham \`LEAD_STATUS\` / \`leadSchema\`; um contract test compara enum e conjunto de campos em toda execução unitária do CI.
`);
appendOnce('docs/AI-SWARM-GOVERNANCE-AUDIT.md', 'Fechamento do harness de scoring — 2026-08-20', `## Fechamento do harness de scoring — 2026-08-20

O débito explicitamente deixado fora do AI-005 foi implementado:

1. scorer determinístico por cada uma das 8 categorias, com thresholds por caso, categoria e dataset;
2. LLM judge opcional via gateway real, medindo semântica, factualidade, aderência ao playbook e risco de alucinação;
3. runner live que executa as capacidades reais usadas pelo Golden Dataset;
4. CLI \`npm run eval:golden\` com exit code 1 em regressão;
5. gate determinístico sempre presente na suíte unitária protegida; quando GROQ/OpenAI está configurado no CI, a mesma job também roda as 24 capacidades reais + LLM judge;
6. correção do caso \`lead_qualification-003\`, cuja faixa anterior contradizia o threshold real de QUALIFIED (>=70).
`);
appendOnce('docs/CADENCE-CYCLE-AUDIT.md', 'Reconciliação final CYC — 2026-08-20', `## Reconciliação final CYC — 2026-08-20

A lista antiga que ainda citava **CYC-002/003/004/005/006/007/009** como pendentes foi reconciliada contra a main. Esses itens já estavam implementados e encerrados nas ondas 22 e 24–29; nenhuma reimplementação foi feita nesta rodada para evitar duplicação/regressão. O bloco CYC-001..009 permanece concluído.
`);

write('.agents/runs/onda-37.md', `# Onda 37 — fechamento DATA-006/007/008 + Golden Dataset scoring

Data: 2026-08-20

## Escopo
- Reconciliar CYC pendente em referências antigas.
- Fechar DATA-006/007/008.
- Implementar harness automático do Golden Dataset, thresholds, LLM judge e integração no CI.

## Resultado esperado
- CYC: sem mudanças funcionais, pois CYC-002/003/004/005/006/007/009 já estavam concluídos na main.
- DATA-006: calendário BRT canônico e regressões de fronteira UTC/BRT.
- DATA-007: previsor sem implementação duplicada frontend/backend.
- DATA-008: OpenAPI de Lead travado por contract test contra Zod.
- AI evaluation: scorer por categoria, LLM judge, runner live, CLI e gate CI.

## Evidência
A automação desta onda só cria o commit final depois de executar typecheck, testes focados e build. O CI normal continua sendo a autoridade final antes de merge na main protegida.
`);

console.log('Roadmap patches applied successfully.');
