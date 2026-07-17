import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './src/lib/prisma.js';
import { initializeWorkflowEngine } from './server/services/workflow/registry/index.js';
import { setupSecurityHeaders, setupCors, setupRateLimiter, setupCookieParser, addTraceId } from './server/security/middleware.js';
import { AuditService } from './server/security/AuditService.js';
import { requireTenant, requirePermission } from './server/security/authorization.js';
import { validateRequest, registerSchema, loginSchema, profileUpdateSchema, prospectCriteriaSchema, intelligenceToolSchema } from './server/security/validation.js';

// Initialize Workflow Engine (EventBus, Triggers, Registry)
initializeWorkflowEngine();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { generateAccessToken, generateRefreshToken, verifyToken, checkReplayAttack } from './server/security/auth.js';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const user = verifyToken(token);
        req.user = user;

        // Replay attack protection if nonce is provided
        const nonce = req.headers['x-nonce'];
        if (nonce && typeof nonce === 'string') {
            if (!checkReplayAttack(nonce)) {
                res.status(401).json({ error: 'Replay attack detected' });
                return;
            }
        }

        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
};


async function startServer() {
    const app = express();
    const PORT = 3000;

    // Security Middlewares
    app.use(setupSecurityHeaders());
    app.use(setupCors());
    app.use(setupRateLimiter());
    app.use(setupCookieParser());
    app.use(addTraceId);

    app.use(express.json());

    // Auth Routes
    app.post('/api/auth/register', validateRequest(registerSchema), async (req, res) => {
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

            await AuditService.logEvent('USER_REGISTERED', 'User', req, user.id);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.post('/api/auth/login', validateRequest(loginSchema), async (req, res) => {
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

            const payload = { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            await AuditService.logEvent('USER_LOGIN', 'User', { ...req, user }, user.id);

            res.json({ token: accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            console.error('Login error:', error);
            await AuditService.logEvent('USER_LOGIN_FAILED', 'User', req, undefined, { error: 'Internal error' });
            res.status(500).json({ error: 'Login failed' });
        }
    });

    app.post('/api/auth/refresh', async (req: any, res: any) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                 return res.status(401).json({ error: 'Refresh token required' });
            }

            const payload = verifyToken(refreshToken, true);
            const user = await prisma.user.findUnique({ where: { id: payload.id } });

            if (!user) {
                return res.status(403).json({ error: 'User no longer exists' });
            }

            const newPayload = { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId };
            const newAccessToken = generateAccessToken(newPayload);
            const newRefreshToken = generateRefreshToken(newPayload);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ token: newAccessToken });
        } catch (error) {
            res.status(403).json({ error: 'Invalid refresh token' });
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

    app.put('/api/auth/profile', authenticateToken, validateRequest(profileUpdateSchema), async (req: any, res: any) => {
        try {
            const { name } = req.body;
            const user = await prisma.user.update({
                where: { id: req.user.id },
                data: { name }
            });
            await AuditService.logEvent('PROFILE_UPDATED', 'User', req, user.id);
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    });

    app.post('/api/auth/logout', (req, res) => {
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    });

    // API Routes
    // Enforce Tenant Isolation and ABAC/RBAC on Core APIs
    app.post('/api/prospect', authenticateToken, requireTenant, requirePermission('use:intelligence'), validateRequest(prospectCriteriaSchema), async (req: any, res: any) => {
        try {
            const tenantId = req.tenantId; // In a full implementation, Prisma queries would be scoped by this ID.
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

            await AuditService.logEvent('PROSPECT_GENERATED', 'AI', req);

            res.json(leads);
        } catch (error) {
            console.error('Error generating leads:', error);
            res.status(500).json({ error: 'Failed to generate leads' });
        }
    });

    app.post('/api/intelligence', authenticateToken, requireTenant, requirePermission('use:intelligence'), validateRequest(intelligenceToolSchema), async (req: any, res: any) => {
        try {
            const tenantId = req.tenantId;
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
            
            await AuditService.logEvent('INTELLIGENCE_USED', 'AI', req, undefined, { tool });

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
