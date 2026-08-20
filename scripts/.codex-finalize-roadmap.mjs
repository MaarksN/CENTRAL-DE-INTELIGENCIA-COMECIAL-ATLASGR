import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, content) => {
  const full = path.join(root, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
};

function replaceOnce(file, from, to) {
  const current = read(file);
  if (current.includes(to)) return;
  if (!current.includes(from)) throw new Error(`Patch anchor not found in ${file}: ${from.slice(0, 140)}`);
  write(file, current.replace(from, to));
}

function appendOnce(file, marker, block) {
  const current = read(file);
  if (current.includes(marker)) return;
  write(file, `${current.trimEnd()}\n\n${block.trim()}\n`);
}

// DATA-006: Comercial Inteligente usa o mesmo calendário canônico de Brasília.
replaceOnce(
  'src/features/commercial-intelligence/application/CommercialIntelligenceUseCases.ts',
  `import { shiftMonth, monthLabelPt, countBusinessDays } from './executiveCalendar';`,
  `import { shiftMonth, monthLabelPt, countBusinessDays } from './executiveCalendar';\nimport { brazilMonthKey, brazilMonthRange } from '../../../shared/time/brazilCalendar.js';`,
);

const oldMonthRangeBlock = [
  "function monthRange(period: string): { start: Date; end: Date; daysInMonth: number } {",
  "    const [year, month] = period.split('-').map(Number);",
  "    const start = new Date(Date.UTC(year, month - 1, 1));",
  "    const end = new Date(Date.UTC(year, month, 1));",
  "    const daysInMonth = Math.round((end.getTime() - start.getTime()) / DAY_MS);",
  "    return { start, end, daysInMonth };",
  "}",
  "",
  "export function currentPeriod(now = new Date()): string {",
  "    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;",
  "}",
].join('\n');
replaceOnce(
  'src/features/commercial-intelligence/application/CommercialIntelligenceUseCases.ts',
  oldMonthRangeBlock,
  `function monthRange(period: string): { start: Date; end: Date; daysInMonth: number } {\n    return brazilMonthRange(period);\n}\n\nexport function currentPeriod(now = new Date()): string {\n    return brazilMonthKey(now);\n}`,
);

// DATA-008: OpenAPI espelha LEAD_STATUS e leadSchema.
replaceOnce(
  'docs/openapi.yaml',
  `        - Call/Visita Agendada\n        - Negócios Perdidos\n        - Negócios Ganhos`,
  `        - Call/Visita Agendada\n        - Piloto VTECH\n        - Piloto Atlas Profile\n        - Piloto Atlas Profile - Concluído\n        - Piloto Atlas Profile - Cancelado\n        - Piloto Logística\n        - Piloto Logístico - Concluído\n        - Piloto Logístico - Cancelado\n        - Negócios Perdidos\n        - Negócios Ganhos`,
);
replaceOnce(
  'docs/openapi.yaml',
  `        contactId: { type: string, nullable: true }\n        pic:`,
  `        contactId: { type: string, nullable: true }\n        funnel: { type: string, enum: [Lead, Negocio] }\n        title: { type: string, maxLength: 180, nullable: true }\n        amount: { type: number, minimum: 0, nullable: true }\n        currency: { type: string, minLength: 3, maxLength: 3 }\n        probability: { type: integer, minimum: 0, maximum: 100, nullable: true }\n        expectedCloseAt: { type: string, nullable: true }\n        pipelineId: { type: string, nullable: true }\n        pipelineStageId: { type: string, nullable: true }\n        customFields: { type: object, nullable: true, additionalProperties: true }\n        pic:`,
);

// Golden Dataset: documentação acompanha o harness já implementado.
replaceOnce(
  'src/features/intelligence/evaluation/goldenDataset.types.ts',
  ` * Deliberadamente NÃO inclui um harness de scoring automático (LLM-judge, threshold, gate de CI):\n * decidir a metodologia de avaliação (comparação exata? similaridade semântica? juiz por LLM?) é\n * decisão de produto que este dataset não tenta resolver sozinho — ver nota de escopo no audit doc.\n * O que este arquivo garante é que cada caso é ESTRUTURALMENTE válido: os campos \`expected\` usam os`,
  ` * O scoring automático vive em \`goldenDataset.scoring.ts\`: checks determinísticos por categoria,\n * thresholds por caso/categoria/geral e um SemanticJudge opcional para factualidade, aderência ao\n * playbook e risco de alucinação. O gate determinístico roda sempre no CI; o live runner usa as\n * capacidades reais e pode acoplar o LLM judge quando um provedor de IA está configurado.\n * Este arquivo continua garantindo que cada caso é ESTRUTURALMENTE válido: os campos \`expected\` usam os`,
);

// Corrige o Sidebar que chegou à main durante esta rodada: imports faltantes + helper morto.
replaceOnce(
  'src/components/layout/Sidebar.tsx',
  `    Activity, Layers, FileBarChart, Zap, ChevronRight, Database, CalendarDays, Cpu, Wallet, FileText,\n    Target, Plug, Settings as SettingsIcon, Download, LineChart, Gauge, UserCog, Headset`,
  `    Activity, Layers, FileBarChart, Zap, ChevronRight, Database, CalendarDays, Cpu, Wallet,\n    Target, Plug, Settings as SettingsIcon, LineChart, Gauge, UserCog, Headset, Globe, Repeat, FileSignature`,
);
const sidebar = read('src/components/layout/Sidebar.tsx');
const navGroupStart = sidebar.indexOf('    function NavGroup(');
const navGroupEnd = sidebar.indexOf('\n    return (', navGroupStart);
if (navGroupStart >= 0 && navGroupEnd > navGroupStart) {
  write('src/components/layout/Sidebar.tsx', sidebar.slice(0, navGroupStart) + sidebar.slice(navGroupEnd));
}

// Segurança: o deploy nunca cria/imprime senha padrão conhecida. O seed já exige >=16 caracteres.
let deploy = read('scripts/deploy-oci.sh');
deploy = deploy.replace(
  /if needs_secret "INITIAL_ADMIN_PASSWORD"; then[\s\S]*?\nfi\n/,
  'ensure_hex_secret "INITIAL_ADMIN_PASSWORD" 24\n',
);
deploy = deploy.replace(
  /echo "Login:[^\n]*"\necho "Senha padrão:[^\n]*"\n/,
  'echo "A credencial inicial do administrador está somente em ${ENV_FILE}."\necho "Nenhum segredo é exibido neste log."\n',
);
write('scripts/deploy-oci.sh', deploy);

appendOnce('docs/DATA-CONTRACT-LEAD.md', 'Fechamento DATA-006/007/008 — 2026-08-20', `## Fechamento DATA-006/007/008 — 2026-08-20

- **DATA-006 — fechado:** fronteiras mensais e mês corrente agora usam um calendário canônico de Brasília em backend, Analytics legado, Comercial Inteligente, frontend e extrações Bitrix. O caso crítico 31/08 23:30 BRT (01/09 UTC) tem regressão automatizada.
- **DATA-007 — fechado:** a segunda implementação client-side de \`buildForecastRange\` / \`computeTrendMomentum\` foi removida; frontend e backend reutilizam o mesmo módulo puro.
- **DATA-008 — fechado:** \`LeadStatus\` e \`LeadInput\` no OpenAPI espelham \`LEAD_STATUS\` / \`leadSchema\`; um contract test compara enum e conjunto de campos em toda execução unitária do CI.`);

appendOnce('docs/AI-SWARM-GOVERNANCE-AUDIT.md', 'Fechamento do harness de scoring — 2026-08-20', `## Fechamento do harness de scoring — 2026-08-20

O débito explicitamente deixado fora do AI-005 foi implementado:

1. scorer determinístico por cada uma das 8 categorias, com thresholds por caso, categoria e dataset;
2. LLM judge opcional via gateway real, medindo semântica, factualidade, aderência ao playbook e risco de alucinação;
3. runner live que executa as capacidades reais usadas pelo Golden Dataset;
4. CLI \`npm run eval:golden\` com exit code 1 em regressão;
5. gate determinístico sempre presente na suíte unitária protegida; quando GROQ/OpenAI está configurado no CI, a mesma job também roda as 24 capacidades reais + LLM judge;
6. correção do caso \`lead_qualification-003\`, cuja faixa anterior contradizia o threshold real de QUALIFIED (>=70).`);

appendOnce('docs/CADENCE-CYCLE-AUDIT.md', 'Reconciliação final CYC — 2026-08-20', `## Reconciliação final CYC — 2026-08-20

A lista antiga que ainda citava **CYC-002/003/004/005/006/007/009** como pendentes foi reconciliada contra a main. Esses itens já estavam implementados e encerrados nas ondas 22 e 24–29; nenhuma reimplementação foi feita nesta rodada para evitar duplicação/regressão. O bloco CYC-001..009 permanece concluído.`);

write('.agents/runs/onda-37.md', `# Onda 37 — fechamento DATA-006/007/008 + Golden Dataset scoring

Data: 2026-08-20

## Escopo
- Reconciliar CYC pendente em referências antigas.
- Fechar DATA-006/007/008.
- Implementar harness automático do Golden Dataset, thresholds e LLM judge.
- Corrigir bloqueadores de CI encontrados na main durante a integração.

## Resultado
- CYC: sem mudanças funcionais; CYC-002/003/004/005/006/007/009 já estavam concluídos.
- DATA-006: calendário BRT canônico e regressões de fronteira UTC/BRT.
- DATA-007: previsor sem implementação duplicada frontend/backend.
- DATA-008: OpenAPI de Lead travado por contract test contra Zod.
- AI evaluation: scorer por categoria, LLM judge, runner live e CLI.
- Integração: Sidebar corrigido e credencial padrão removida do deploy OCI.

## Validação
Typecheck, testes focados e build são executados sobre a branch já mesclada localmente com a main atual antes do push.`);

console.log('Remaining roadmap patches applied successfully.');
