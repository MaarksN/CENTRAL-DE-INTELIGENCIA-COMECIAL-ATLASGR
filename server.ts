import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRoutes } from './src/features/auth/routes/auth.routes.js';
import { intelligenceRoutes } from './src/features/intelligence/routes/intelligence.routes.js';
import { authenticateToken } from './src/shared/middlewares/authenticateToken.js';
import { prisma } from './src/lib/prisma.js';
import { companyRoutes } from './src/features/companies/routes/company.routes.js';
import { contactRoutes } from './src/features/contacts/routes/contact.routes.js';
import { leadRoutes } from './src/features/crm/routes/lead.routes.js';
import { activityRoutes } from './src/features/activities/routes/activity.routes.js';
import { prospectingRoutes } from './src/features/prospecting/routes/prospecting.routes.js';
import { errorHandler } from './src/shared/middlewares/errorHandler.js';

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Health Checks
    app.get('/health/live', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/health/ready', async (req, res) => {
        try {
            // Check Database connection
            await prisma.$queryRaw`SELECT 1`;
            res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        } catch (error) {
            console.error('Readiness probe failed:', error);
            res.status(503).json({ status: 'error', message: 'Database unavailable' });
        }
    });

    // Auth Routes
    app.use('/api/auth', authRoutes);

    // API Routes Mounts
    app.use('/api/companies', authenticateToken, companyRoutes);
    app.use('/api/contacts', authenticateToken, contactRoutes);
    app.use('/api/leads', authenticateToken, leadRoutes);
    app.use('/api/activities', authenticateToken, activityRoutes);
    app.use('/api/prospecting', authenticateToken, prospectingRoutes);


    // --- Notes API ---
    app.post('/api/leads/:id/notes', authenticateToken, async (req: express.Request, res: express.Response) => {
        try {
            const orgId = (req as any).user.organizationId;
            const { content, author } = req.body;
            const leadId = req.params.id;

            // Optional: verify lead belongs to orgId
            const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId: orgId } });
            if (!lead) return res.status(404).json({ error: 'Lead not found' });

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


    app.use('/api/intelligence', authenticateToken, intelligenceRoutes);

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
    app.use(errorHandler);

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
