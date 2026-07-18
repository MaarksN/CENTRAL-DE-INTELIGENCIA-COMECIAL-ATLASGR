import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import { noteRoutes } from './src/features/notes/routes/note.routes.js';
import { errorHandler } from './src/shared/middlewares/errorHandler.js';

async function startServer() {
    const app = express();
    const PORT = 3000;

    // Security Middlewares (Hardening)
    app.use(helmet());

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' }
    });

    // Apply the rate limiting middleware to API calls only
    app.use('/api', apiLimiter);

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
    app.use('/api/leads/:leadId/notes', authenticateToken, noteRoutes);
    app.use('/api/activities', authenticateToken, activityRoutes);
    app.use('/api/prospecting', authenticateToken, prospectingRoutes);


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
