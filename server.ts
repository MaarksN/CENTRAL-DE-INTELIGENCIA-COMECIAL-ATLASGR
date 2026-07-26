import { initTracing } from './src/lib/tracing.js';
initTracing();

import { env } from './src/config/env.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './src/lib/auth.js';
import { intelligenceRoutes } from './src/features/intelligence/routes/intelligence.routes.js';
import { promptRoutes } from './src/features/intelligence/routes/prompt.routes.js';
import { authenticateToken } from './src/shared/middlewares/authenticateToken.js';
import { requireTenant } from './src/shared/middlewares/authorization.js';
import { prisma } from './src/lib/prisma.js';
import { companyRoutes } from './src/features/companies/routes/company.routes.js';
import { contactRoutes } from './src/features/contacts/routes/contact.routes.js';
import { leadRoutes } from './src/features/crm/routes/lead.routes.js';
import { activityRoutes } from './src/features/activities/routes/activity.routes.js';
import { prospectingRoutes } from './src/features/prospecting/routes/prospecting.routes.js';
import { noteRoutes } from './src/features/notes/routes/note.routes.js';
import { errorHandler } from './src/shared/middlewares/errorHandler.js';
import { logger } from './src/lib/logger.js';
import { createLeadsWorker } from './src/lib/queue/index.js';
import { createAgentWorker } from './src/lib/queue/agent.worker.js';
import { createEnrichmentWorker } from './src/lib/queue/enrichment.queue.js';
import { createSearchWorker } from './src/lib/queue/search.queue.js';
import { initMeiliIndexes } from './src/lib/search/index.js';
import { observabilityMiddleware } from './src/shared/middlewares/observability.js';
import client from 'prom-client';
import { setupDI } from './src/shared/di/setup.js';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { leadsQueue } from './src/lib/queue/index.js';
import { searchQueue } from './src/lib/queue/search.queue.js';
import { agentQueue } from './src/lib/queue/agent.worker.js';
import { companyQueue, createCompanyWorker } from './src/lib/queue/company.worker.js';
import { isOriginAllowed, parseAllowedOrigins } from './src/config/network.js';
import { queuesEnabled } from './src/lib/queue/redis.js';

const ALLOWED_ORIGINS = parseAllowedOrigins(env.ALLOWED_ORIGINS);

if (env.NODE_ENV === 'production' && ALLOWED_ORIGINS.length === 0) {
    console.error('FATAL ERROR: ALLOWED_ORIGINS is not set in production. Failing fast.');
    process.exit(1);
}

async function startServer() {
    const app = express();
    const PORT = parseInt(env.PORT, 10);
    app.disable('x-powered-by');
    app.set('trust proxy', env.TRUST_PROXY ? 1 : false);

    // ── Segurança ──────────────────────────────────────────────────────────
    // Helmet adiciona cabeçalhos HTTP de segurança (X-Frame-Options, HSTS, etc.)
    app.use(helmet({
        contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
    }));

    app.use(cors({
        origin(origin, callback) {
            if (isOriginAllowed(origin, ALLOWED_ORIGINS)) {
                callback(null, true);
                return;
            }
            callback(new Error('Origem não autorizada pelo CORS'));
        },
        credentials: true, // Necessário para Better Auth
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compressão gzip/brotli — reduz tamanho de resposta até 70%
    app.use(compression());

    const apiLimiter = rateLimit({
        windowMs: 60_000,
        limit: env.API_RATE_LIMIT_MAX,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: { success: false, error: 'Muitas requisições. Aguarde um instante e tente novamente.' },
    });
    const aiLimiter = rateLimit({
        windowMs: 60_000,
        limit: env.AI_RATE_LIMIT_MAX,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: { success: false, error: 'Limite temporário de IA atingido. Tente novamente em um minuto.' },
    });
    app.use('/api/intelligence', aiLimiter);
    app.use('/api/prompts', aiLimiter);
    app.use('/api', apiLimiter);

    app.use(express.json({ limit: env.JSON_BODY_LIMIT }));

    // ── Metrics ────────────────────────────────────────────────────────────
    if (env.EXPOSE_METRICS) {
        client.collectDefaultMetrics();
        app.get('/metrics', authenticateToken, requireTenant, async (_req, res) => {
            try {
                res.set('Content-Type', client.register.contentType);
                res.end(await client.register.metrics());
            } catch (ex) {
                res.status(500).end(ex);
            }
        });
    }

    // ── Health Checks ──────────────────────────────────────────────────────
    app.get('/health/live', (_req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/health/ready', async (_req, res) => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        } catch (error) {
            logger.error({ err: error }, 'Readiness probe failed');
            res.status(503).json({ status: 'error', message: 'Database unavailable' });
        }
    });

    // ── Auth (Better Auth) ─────────────────────────────────────────────────
    app.all('/api/auth/*', toNodeHandler(auth));

    // ── BullBoard (UI de Monitoramento de Filas) ──────────────────────────
    if (queuesEnabled) {
        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/admin/queues');
        createBullBoard({
            queues: [
                new BullMQAdapter(leadsQueue),
                new BullMQAdapter(searchQueue),
                new BullMQAdapter(agentQueue),
                new BullMQAdapter(companyQueue)
            ],
            serverAdapter,
        });
        app.use('/admin/queues', authenticateToken, requireTenant, serverAdapter.getRouter());
    } else {
        app.get('/admin/queues', (_req, res) => {
            res.status(503).json({ success: false, error: 'Filas desabilitadas nesta instalação.' });
        });
    }

    // ── Rotas protegidas ───────────────────────────────────────────────────
    app.use(observabilityMiddleware);

    app.use('/api/companies', authenticateToken, requireTenant, companyRoutes);
    app.use('/api/contacts', authenticateToken, requireTenant, contactRoutes);
    app.use('/api/leads', authenticateToken, requireTenant, leadRoutes);
    app.use('/api/leads/:leadId/notes', authenticateToken, requireTenant, noteRoutes);
    app.use('/api/activities', authenticateToken, requireTenant, activityRoutes);
    app.use('/api/prospecting', authenticateToken, requireTenant, prospectingRoutes);
    app.use('/api/intelligence', authenticateToken, requireTenant, intelligenceRoutes);
    app.use('/api/prompts', authenticateToken, requireTenant, promptRoutes);

    // ── Analytics Overview (Platform Stats Dashboard) ────────────────────────
    app.get('/api/analytics/overview', authenticateToken, requireTenant, async (req, res) => {
        try {
            const orgId = (req as any).organizationId;
            const [totalCompanies, totalContacts, totalLeads, totalActivities, pendingActivities, closedLeads] = await Promise.all([
                prisma.company.count({ where: { organizationId: orgId } }),
                prisma.contact.count({ where: { organizationId: orgId } }),
                prisma.lead.count({ where: { organizationId: orgId } }),
                prisma.activity.count({ where: { organizationId: orgId } }),
                prisma.activity.count({ where: { organizationId: orgId, status: 'Pendente' } }),
                prisma.lead.count({ where: { organizationId: orgId, status: 'Fechado_Ganho', updatedAt: { gte: new Date(new Date().setDate(1)) } } }),
            ]);
            res.json({
                success: true,
                data: {
                    totalCompanies,
                    totalContacts,
                    totalLeads,
                    totalActivities,
                    pendingActivities,
                    closedThisMonth: closedLeads,
                    pipelineValue: 0,
                    conversionRate: totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100 * 10) / 10 : 0,
                }
            });
        } catch (err) {
            logger.error({ err }, 'Analytics overview error');
            res.status(500).json({ success: false, error: 'Erro ao carregar estatísticas' });
        }
    });

    // ── Frontend ───────────────────────────────────────────────────────────
    if (env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    // ── Error Handler (deve ser o último middleware) ───────────────────────
    app.use(errorHandler);

    const httpServer = app.listen(PORT, env.HOST, () => {
        logger.info(
            { host: env.HOST, port: PORT, env: env.NODE_ENV, allowedOrigins: ALLOWED_ORIGINS },
            `Server running on http://${env.HOST}:${PORT}`
        );
    });

    // ── Bootstrapping DI & Services ───────────────────────────────────────
    try {
        setupDI();
        let workers: any[] = [];
        if (queuesEnabled) {
            try {
                workers = [
                    createLeadsWorker(),
                    createAgentWorker(),
                    createSearchWorker(),
                    createCompanyWorker(),
                    createEnrichmentWorker(),
                ];
            } catch (wErr) {
                logger.warn({ wErr }, 'Queue workers skipped (Redis offline)');
            }
        }
        if (env.ENABLE_SEARCH) {
            initMeiliIndexes().catch(err => logger.warn({ err }, 'Meilisearch optional index init bypassed'));
        }

        // Graceful shutdown
        let shuttingDown = false;
        const shutdown = async (signal: string) => {
            if (shuttingDown) return;
            shuttingDown = true;
            logger.info(`${signal} received: closing gracefully`);
            await new Promise<void>((resolve) => {
                httpServer.close(() => resolve());
                setTimeout(resolve, 5_000).unref();
            });
            for (const w of workers) {
                await w?.close().catch(() => {});
            }
            await prisma.$disconnect().catch(() => {});
            process.exit(0);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (err) {
        logger.warn({ err }, 'Background worker bootstrap warning');
    }
}

startServer().catch((error) => {
    logger.fatal({ err: error }, 'Server failed to start');
    process.exit(1);
});
