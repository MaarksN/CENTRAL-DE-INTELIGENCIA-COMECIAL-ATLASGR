import { getAiModel, estimateCostUsd } from '../../../lib/ai/gateway.js';
import { HumanMessage } from '@langchain/core/messages';
import { compileLeadGraph } from '../graphs/leadQualification.js';
import { prisma } from '../../../lib/prisma.js';

export type ContentTool =
    | 'script_call'
    | 'script_whatsapp'
    | 'script_email'
    | 'prompt'
    | 'objections'
    | 'followup'
    | 'profile'
    | 'risk'
    | 'linkedin_invite'
    | 'voicemail'
    | 'roi_pitch';

const SYSTEM_PREAMBLE = `Você é um consultor de vendas B2B sênior da Atlas, uma plataforma SaaS de inteligência logística focada em reduzir custos com gestão de exceções e sinistros (roubo de carga, avarias, atrasos) para transportadoras, embarcadores e operadores logísticos no Brasil. Responda sempre em português do Brasil, direto ao ponto, com tom consultivo e persuasivo — nunca genérico ou robótico. Nunca use placeholders óbvios como "[Nome]" quando o nome real estiver disponível no contexto abaixo; se algum dado não estiver disponível, contorne com uma pergunta aberta em vez de inventar um dado factual (nome de pessoa, número, data).`;

/** Instruções específicas de cada ferramenta — o "molde" de cada tipo de conteúdo gerado. */
const TOOL_PROMPTS: Record<ContentTool, string> = {
    script_call: `Crie um script de Cold Call para o time comercial ligar para este lead agora. Estruture em 4 blocos curtos e nomeados:
1) ABERTURA (até 10 segundos, gancho que prende atenção — evite "tudo bem?" genérico)
2) DIAGNÓSTICO (2 perguntas abertas para confirmar a dor antes de vender)
3) CONTORNO RÁPIDO (uma frase pronta para a objeção mais provável que esse tipo de lead vai levantar)
4) FECHAMENTO (CTA objetivo pedindo 15-20 min de agenda, com 2 opções de horário)
Use linguagem natural de quem fala ao telefone, frases curtas, sem jargão corporativo.`,

    script_whatsapp: `Crie DUAS variações de mensagem de prospecção para WhatsApp/LinkedIn (Social Selling), rotuladas "VARIAÇÃO A (mais formal)" e "VARIAÇÃO B (mais casual, com emoji moderado)". Cada uma com no máximo 3 parágrafos curtos, gatilho de curiosidade sobre gestão de sinistros/anomalias logísticas, sem jargões complexos e terminando em uma pergunta simples de responder (não peça reunião de cara).`,

    script_email: `Crie um Cold E-mail. Dê DUAS opções de assunto (rotuladas "Assunto A" e "Assunto B", uma mais direta e outra mais curiosa) e UM corpo de e-mail conciso (até 120 palavras) com: dor específica do setor logístico, uma prova social (menção genérica a "transportadoras que já reduziram X% em sinistros" sem inventar nome de cliente ou número certificado), e um Call to Action de resposta binária ("faz sentido bater um papo de 15 min essa semana ou seria melhor eu voltar em outro momento?").`,

    prompt: `Crie 4 perguntas de qualificação profundas (estilo BANT/SPIN) para a próxima ligação/reunião com este lead, cada uma seguida de UMA linha explicando o que a resposta revela para o vendedor (ex: orçamento, autoridade, urgência, ou o tamanho real da dor).`,

    objections: `Monte uma matriz com as 3 objeções mais prováveis para este lead específico na venda de um software de inteligência logística, no formato "OBJEÇÃO → CONTORNO". Para cada objeção, o contorno deve validar a preocupação antes de reverter (nunca descartar a objeção), e terminar com uma pergunta que devolve a conversa pro vendedor.`,

    followup: `Crie um e-mail de follow-up pós-reunião de demonstração para este lead. Reforce em 2-3 bullets os benefícios discutidos (controle em tempo real, redução de sinistros, visibilidade de frota), inclua um resumo de 1 frase do que foi combinado na reunião (genérico se não houver detalhe específico) e proponha um próximo passo com data sugerida.`,

    profile: `Faça uma análise de abordagem para o decisor deste lead usando a metodologia DiSC como base: (1) qual perfil comportamental é mais provável dado o cargo/segmento, (2) o que esse perfil valoriza numa conversa comercial, (3) como ajustar tom de voz e ritmo, (4) um erro comum a evitar com esse perfil.`,

    risk: `Liste os 3 maiores riscos que podem fazer a Atlas perder esta negociação no final do funil, considerando os dados reais do lead abaixo (situação cadastral, porte, região, temperatura). Para cada risco, dê uma ação preventiva concreta a tomar ainda nesta semana.`,

    linkedin_invite: `Crie um convite de conexão no LinkedIn (máximo 300 caracteres, sem saudação genérica tipo "Olá, gostaria de me conectar") e, em seguida, uma mensagem de follow-up para enviar 2 dias depois de aceito o convite, iniciando a conversa comercial sem parecer um script de vendas.`,

    voicemail: `Crie um script de recado de caixa postal (voicemail) para quando o decisor não atender a ligação. Deve durar entre 20-30 segundos falado (aproximadamente 60-80 palavras), dizer quem liga e por quê em uma frase, deixar um motivo específico de retorno (não "gostaria de conversar"), e terminar com telefone/e-mail para retorno.`,

    roi_pitch: `Monte um "pitch de números" que traduza o risco logístico deste lead em impacto financeiro estimado, para usar como gancho consultivo. Baseie-se no que está descrito no contexto do lead (porte, região, segmento) e em benchmarks públicos conhecidos do setor de transporte de cargas no Brasil (ex: índices de roubo de carga mais altos em SP e RJ). Deixe explícito que é uma ESTIMATIVA ILUSTRATIVA para abrir a conversa, não um número auditado — nunca apresente como dado certificado. Termine sugerindo perguntar ao lead o número real dele para comparar.`,
};

interface LeadContext {
    text: string;
    companyName?: string;
    contactName?: string;
}

/** Monta um bloco de contexto real (Company + Contact + Lead) para personalizar o prompt — sem isso, a IA só produz conteúdo genérico. */
async function buildLeadContext(leadId?: string | null): Promise<LeadContext> {
    if (!leadId) return { text: '' };

    const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: { company: true, contact: true },
    });
    if (!lead) return { text: '' };

    const c = lead.company;
    const p = lead.contact;
    const lines: string[] = [];

    if (c) {
        lines.push(`- Empresa: ${c.tradeName}${c.legalName && c.legalName !== c.tradeName ? ` (razão social: ${c.legalName})` : ''}`);
        if (c.segment) lines.push(`- Segmento: ${c.segment}`);
        if (c.city || c.state) lines.push(`- Localização: ${[c.city, c.state].filter(Boolean).join(', ')}`);
        if (c.size) lines.push(`- Porte: ${c.size}${c.employeeCount ? ` (estimativa de ~${c.employeeCount} funcionários)` : ''}`);
        if (c.situacaoCadastral) lines.push(`- Situação cadastral (Receita Federal): ${c.situacaoCadastral}`);
        if (c.googleRating != null) lines.push(`- Reputação no Google: nota ${c.googleRating} (${c.googleReviewsCount ?? 0} avaliações)`);
        if (c.technologies?.length) lines.push(`- Tecnologias em uso: ${c.technologies.slice(0, 6).join(', ')}`);
        if (c.observations) lines.push(`- Resumo do enriquecimento: ${c.observations}`);
    }
    if (p) {
        lines.push(`- Contato/decisor: ${p.name}${p.role ? `, cargo: ${p.role}` : ''}${p.department ? ` (departamento: ${p.department})` : ''}`);
    }
    if (lead.temperature || lead.score != null) {
        lines.push(`- Temperatura do lead: ${lead.temperature ?? 'não avaliada'}${lead.score != null ? ` (score ${lead.score}/100)` : ''}`);
    }
    if (lead.source) lines.push(`- Origem do lead: ${lead.source}`);

    if (lines.length === 0) return { text: '' };

    return {
        text: `\n\n## Contexto real deste lead — use estes dados, não invente outros:\n${lines.join('\n')}`,
        companyName: c?.tradeName,
        contactName: p?.name,
    };
}

export class AIService {
    async generateContent(tool: string, leadId?: string | null) {
        if (!(tool in TOOL_PROMPTS)) {
            throw new Error('Invalid tool');
        }
        const toolId = tool as ContentTool;

        let promptStr = `${SYSTEM_PREAMBLE}\n\n${TOOL_PROMPTS[toolId]}`;

        // Prompt customizado salvo no banco (se existir) tem prioridade sobre o padrão da ferramenta.
        const dbPrompt = await prisma.prompt.findFirst({ where: { category: tool } });
        if (dbPrompt?.variables) {
            promptStr += `\n\nInstruções adicionais definidas pelo time: ${JSON.stringify(dbPrompt.variables)}`;
        }

        const context = await buildLeadContext(leadId);
        promptStr += context.text;

        const model = getAiModel('gemini-flash', 0.7);
        const startTime = Date.now();
        const response = await model.invoke([new HumanMessage(promptStr)]);
        const latencyMs = Date.now() - startTime;

        const usage = response.response_metadata.tokenUsage;
        const cost = estimateCostUsd(response.response_metadata.model, usage);

        await prisma.aILog.create({
            data: {
                tokens: usage.totalTokens,
                cost,
                latencyMs,
                model: response.response_metadata.model,
                promptId: dbPrompt?.id,
            },
        });

        return response.content;
    }

    async qualifyLead(leadId: string, companyInfo: string) {
        const graph = compileLeadGraph();
        const finalState = await graph.invoke({ leadId, companyInfo });
        return finalState;
    }
}
export const aiService = new AIService();
