import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // API Routes
    app.post('/api/prospect', async (req, res) => {
        try {
            const criteria = req.body;
            const prompt = `Você é um assistente de prospecção B2B (SDR/BDR) da Atlas (empresa de inteligência logística).
Baseado nestes critérios, gere uma lista de 4 a 6 leads reais (empresas do Brasil) que se encaixam no perfil:
- Segmento: ${criteria.segmento}
- Localização: ${criteria.localizacao}
- Tamanho da Frota: ${criteria.tamanhoFrota}
- Faturamento: ${criteria.faturamento}
- Dor Principal: ${criteria.dorPrincipal}
- Tecnologia Atual: ${criteria.tecnologiaAtual}

Retorne APENAS um array JSON de objetos, onde cada objeto tem:
{
  "name": "Nome da Empresa",
  "segment": "Sub-segmento específico",
  "size": "Tamanho da frota aproximado",
  "location": "Cidade, UF",
  "fitScore": número de 0 a 100 indicando o fit com o perfil (aleatório entre 75 e 98)
}
Nenhum texto adicional, sem formatação markdown (como \`\`\`json), apenas o JSON válido em texto plano.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                }
            });
            
            const text = response.text || "[]";
            const leads = JSON.parse(text);
            res.json(leads);
        } catch (error) {
            console.error('Error generating leads:', error);
            res.status(500).json({ error: 'Failed to generate leads' });
        }
    });

    app.post('/api/intelligence', async (req, res) => {
        try {
            const { tool } = req.body;
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
                return res.status(400).json({ error: 'Invalid tool' });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            res.json({ result: response.text });
        } catch (error) {
            console.error('Error generating intelligence:', error);
            res.status(500).json({ error: 'Failed to generate content' });
        }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }


    // Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Global Error Handler:', err);
        const status = err.statusCode || 500;
        res.status(status).json({
            error: {
                message: err.message || 'Internal Server Error',
                status
            }
        });
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
