import { Router, Request, Response, NextFunction } from 'express';

import { aiService } from '../services/ai.service.js';
import { leadsQueue } from '../../../lib/queue/index.js';
import { logger } from '../../../lib/logger.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { tool, leadId } = req.body as { tool: string; leadId?: string };
        const result = await aiService.generateContent(tool, leadId);
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

        if (!leadId) {
            res.status(400).json({ error: 'Missing leadId' });
            return;
        }

        // companyInfo é opcional — quando ausente, o worker busca os dados reais da empresa no CRM.
        const job = await leadsQueue.add('qualify-lead', { leadId, companyInfo: companyInfo || '' });

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
