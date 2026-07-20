import { Router, Request, Response, NextFunction } from 'express';

import { aiService } from '../services/ai.service.js';
import { leadsQueue } from '../../../lib/queue/index.js';
import { logger } from '../../../lib/logger.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { tool } = req.body as { tool: string };
        const result = await aiService.generateContent(tool);
        res.json({ result });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === 'Invalid tool') {
            res.status(400).json({ error: err.message });
            return;
        }
        logger.error({ err: error }, 'Error generating intelligence');
        next(error);
    }
});

router.post('/qualify', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { leadId, companyInfo } = req.body as { leadId?: string; companyInfo?: string };

        if (!leadId || !companyInfo) {
            res.status(400).json({ error: 'Missing leadId or companyInfo' });
            return;
        }

        // Push to BullMQ instead of blocking the request
        const job = await leadsQueue.add('qualify-lead', { leadId, companyInfo });

        res.status(202).json({
            message: 'Lead qualification started in background',
            jobId: job.id
        });
    } catch (error) {
        logger.error({ err: error }, 'Error queuing lead qualification');
        next(error);
    }
});

export const intelligenceRoutes = router;
