import { getAiModel } from '../../../lib/ai/gateway.js';
import { HumanMessage } from '@langchain/core/messages';
import { compileLeadGraph } from '../graphs/leadQualification.js';
import { prisma } from '../../../lib/prisma.js';

export class AIService {
    async generateContent(tool: string) {
        let promptStr = `Você é um consultor de vendas B2B experiente da Atlas, uma plataforma SaaS de inteligência logística focada em reduzir custos com gestão de exceções e sinistros para transportadoras. Responda em português do Brasil de forma extremamente persuasiva e profissional.`;
        
        const dbPrompt = await prisma.prompt.findFirst({
            where: { category: tool }
        });

        if (dbPrompt) {
            promptStr += `\n${dbPrompt.variables ? JSON.stringify(dbPrompt.variables) : ''}`;
        } else {
            if (tool === 'script_call') {
                promptStr += `\nCrie um script de Cold Call curto e direto ao ponto, baseado em dores reais do setor logístico. Foco em prender a atenção nos primeiros 10 segundos e agendar uma reunião. Sem placeholders genéricos, use nomes plausíveis.`;
            } else if (tool === 'script_whatsapp') {
                promptStr += `\nCrie uma mensagem de prospecção para WhatsApp ou LinkedIn (Social Selling). Deve ser informal, curta (máx 3 parágrafos curtos), sem jargões complexos, com um gatilho de curiosidade sobre gestão de anomalias logísticas. Use emojis moderadamente.`;
            } else if (tool === 'script_email') {
                promptStr += `\nCrie um template de Cold E-mail focado na dor de perdas financeiras com sinistros em transportadoras. Assunto chamativo, corpo conciso com prova social e um Call to Action simples de 'sim ou não'.`;
            } else if (tool === 'prompt') {
                promptStr += `\nCrie 4 perguntas de qualificação profundas (estilo BANT/SPIN) para descobrir as dores de uma transportadora na gestão de sinistros e controle de frota.`;
            } else if (tool === 'objections') {
                promptStr += `\nListe 3 objeções comuns na venda de um software logístico (ex: 'já usamos TMS', 'está caro', 'os motoristas não vão usar') e como contorná-las de forma persuasiva.`;
            } else if (tool === 'followup') {
                promptStr += `\nCrie um e-mail de follow-up pós-reunião de demonstração, reforçando os benefícios de controle em tempo real e propondo um próximo passo claro.`;
            } else if (tool === 'profile') {
                promptStr += `\nFaça uma breve análise de como abordar um decisor de logística (ex: Diretor de Operações ou Dono de Transportadora). O que eles valorizam? Como ajustar o tom de voz? (use a metodologia DiSC como base).`;
            } else if (tool === 'risk') {
                promptStr += `\nListe os 3 maiores riscos que podem fazer a Atlas perder uma negociação de CRM logístico no final do funil e como mitigá-los preventivamente.`;
            } else {
                throw new Error('Invalid tool');
            }
        }

        const model = getAiModel('gemini-pro', 0.7);
        const startTime = Date.now();
        const response = await model.invoke([
            new HumanMessage(promptStr)
        ]);
        const latencyMs = Date.now() - startTime;

        await prisma.aILog.create({
            data: {
                tokens: (response.response_metadata as any)?.tokenUsage?.totalTokens || 0,
                cost: 0,
                latencyMs,
                model: 'gemini-pro',
                promptId: dbPrompt?.id
            }
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
