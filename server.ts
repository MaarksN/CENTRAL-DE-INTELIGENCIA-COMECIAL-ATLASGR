import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from './src/lib/prisma.js';
import { companyService } from './src/features/companies/services/company.service.js';
import { contactService } from './src/features/contacts/services/contact.service.js';
import { leadService } from './src/features/crm/services/lead.service.js';
import { activityService } from './src/features/activities/services/activity.service.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};


async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Auth Routes
    app.post('/api/auth/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Get Atlas GR org
            const atlasOrg = await prisma.organization.findUnique({ where: { name: 'Atlas GR' } });
            if (!atlasOrg) {
                 return res.status(500).json({ error: 'Default organization not found' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    organizationId: atlasOrg.id,
                    role: 'VISUALIZADOR' // Default role
                }
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.passwordHash);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    });

    app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    });

    app.put('/api/auth/profile', authenticateToken, async (req: any, res: any) => {
        try {
            const { name } = req.body;
            const user = await prisma.user.update({
                where: { id: req.user.id },
                data: { name }
            });
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    });

    // Logout is handled client side by removing token, but providing an endpoint if needed
    app.post('/api/auth/logout', (req, res) => {
        res.json({ message: 'Logged out successfully' });
    });

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

    // --- Companies API ---
    app.get('/api/companies', async (req, res) => {
        try {
            const companies = await companyService.findAll(req.query.q as string | undefined);
            res.json(companies);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch companies' });
        }
    });

    app.get('/api/companies/:id', async (req, res) => {
        try {
            const company = await companyService.findById(req.params.id);
            if (!company) return res.status(404).json({ error: 'Company not found' });
            res.json(company);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch company' });
        }
    });

    app.post('/api/companies', async (req, res) => {
        try {
            const company = await companyService.create(req.body);
            res.status(201).json(company);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create company' });
        }
    });

    app.put('/api/companies/:id', async (req, res) => {
        try {
            const company = await companyService.update(req.params.id, req.body);
            res.json(company);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update company' });
        }
    });

    app.delete('/api/companies/:id', async (req, res) => {
        try {
            await companyService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete company' });
        }
    });

    // --- Contacts API ---
    app.get('/api/contacts', async (req, res) => {
        try {
            const contacts = await contactService.findAll(req.query.q as string | undefined);
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch contacts' });
        }
    });

    app.get('/api/contacts/:id', async (req, res) => {
        try {
            const contact = await contactService.findById(req.params.id);
            if (!contact) return res.status(404).json({ error: 'Contact not found' });
            res.json(contact);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch contact' });
        }
    });

    app.post('/api/contacts', async (req, res) => {
        try {
            const contact = await contactService.create(req.body);
            res.status(201).json(contact);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create contact' });
        }
    });

    app.put('/api/contacts/:id', async (req, res) => {
        try {
            const contact = await contactService.update(req.params.id, req.body);
            res.json(contact);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update contact' });
        }
    });

    app.delete('/api/contacts/:id', async (req, res) => {
        try {
            await contactService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete contact' });
        }
    });

    // --- Leads API ---
    app.get('/api/leads', async (req, res) => {
        try {
            const leads = await leadService.findAll(req.query.status as string | undefined);
            res.json(leads);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch leads' });
        }
    });

    app.get('/api/leads/:id', async (req, res) => {
        try {
            const lead = await leadService.findById(req.params.id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            res.json(lead);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch lead' });
        }
    });

    app.post('/api/leads', async (req, res) => {
        try {
            const lead = await leadService.create(req.body);
            res.status(201).json(lead);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create lead' });
        }
    });

    app.put('/api/leads/:id', async (req, res) => {
        try {
            const leadId = req.params.id;
            let lead;
            if (req.body.status && Object.keys(req.body).length === 1) {
                lead = await leadService.updateStatus(leadId, req.body.status);
            } else {
                lead = await leadService.update(leadId, req.body);
            }
            res.json(lead);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update lead' });
        }
    });

    app.delete('/api/leads/:id', async (req, res) => {
        try {
            await leadService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete lead' });
        }
    });

    // --- Activities API ---
    app.get('/api/activities', async (req, res) => {
        try {
            const activities = await activityService.findAll(req.query.date as string | undefined);
            res.json(activities);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch activities' });
        }
    });

    app.post('/api/activities', async (req, res) => {
        try {
            const activity = await activityService.create(req.body);
            res.status(201).json(activity);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create activity' });
        }
    });

    app.put('/api/activities/:id', async (req, res) => {
        try {
            const activity = await activityService.update(req.params.id, req.body);
            res.json(activity);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update activity' });
        }
    });

    app.delete('/api/activities/:id', async (req, res) => {
        try {
            await activityService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete activity' });
        }
    });

    // --- Notes API ---
    app.post('/api/leads/:id/notes', async (req, res) => {
        try {
            const { content, author } = req.body;
            const leadId = req.params.id;

            const note = await prisma.note.create({
                data: {
                    content,
                    author,
                    leadId
                }
            });

            await prisma.timelineEvent.create({
                data: {
                    type: 'comment',
                    description: `Nova nota adicionada por ${author}`,
                    leadId
                }
            });

            res.status(201).json(note);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create note' });
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
