import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AIService {
    async generateContent(tool: string) {
        let prompt = `Você é um consultor de vendas B2B experiente da Atlas, uma plataforma SaaS de inteligência logística focada em reduzir custos com gestão de exceções e sinistros para transportadoras. Responda em português do Brasil de forma extremamente persuasiva e profissional.`;
        
        if (tool === 'script_call') {
            prompt += `\nCrie um script de Cold Call curto e direto ao ponto, baseado em dores reais do setor logístico. Foco em prender a atenção nos primeiros 10 segundos e agendar uma reunião. Sem placeholders genéricos, use nomes plausíveis.`;
        } else if (tool === 'script_whatsapp') {
            prompt += `\nCrie uma mensagem de prospecção para WhatsApp ou LinkedIn (Social Selling). Deve ser informal, curta (máx 3 parágrafos curtos), sem jargões complexos, com um gatilho de curiosidade sobre gestão de anomalias logísticas. Use emojis moderadamente.`;
        } else if (tool === 'script_email') {
            prompt += `\nCrie um template de Cold E-mail focado na dor de perdas financeiras com sinistros em transportadoras. Assunto chamativo, corpo conciso com prova social e um Call to Action simples de 'sim ou não'.`;
        } else if (tool === 'prompt') {
            prompt += `\nCrie 4 perguntas de qualificação profundas (estilo BANT/SPIN) para descobrir as dores de uma transportadora na gestão de sinistros e controle de frota.`;
        } else if (tool === 'objections') {
            prompt += `\nListe 3 objeções comuns na venda de um software logístico (ex: 'já usamos TMS', 'está caro', 'os motoristas não vão usar') e como contorná-las de forma persuasiva.`;
        } else if (tool === 'followup') {
            prompt += `\nCrie um e-mail de follow-up pós-reunião de demonstração, reforçando os benefícios de controle em tempo real e propondo um próximo passo claro.`;
        } else if (tool === 'profile') {
            prompt += `\nFaça uma breve análise de como abordar um decisor de logística (ex: Diretor de Operações ou Dono de Transportadora). O que eles valorizam? Como ajustar o tom de voz? (use a metodologia DiSC como base).`;
        } else if (tool === 'risk') {
            prompt += `\nListe os 3 maiores riscos que podem fazer a Atlas perder uma negociação de CRM logístico no final do funil e como mitigá-los preventivamente.`;
        } else {
            throw new Error('Invalid tool');
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });
        
        return response.text;
    }
}
export const aiService = new AIService();
