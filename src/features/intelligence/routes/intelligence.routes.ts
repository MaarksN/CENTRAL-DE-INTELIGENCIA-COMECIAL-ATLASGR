import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import { leadsQueue } from '../../../lib/queue/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tool } = req.body;
        const result = await aiService.generateContent(tool);
        res.json({ result });
    } catch (error: any) {
        if (error.message === 'Invalid tool') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Error generating intelligence:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

router.post('/qualify', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { leadId, companyInfo } = req.body;
        
        if (!leadId || !companyInfo) {
            return res.status(400).json({ error: 'Missing leadId or companyInfo' });
        }

        // Push to BullMQ instead of blocking the request
        const job = await leadsQueue.add('qualify-lead', { leadId, companyInfo });
        
        res.status(202).json({ 
            message: 'Lead qualification started in background',
            jobId: job.id 
        });
    } catch (error: any) {
        console.error('Error queuing lead qualification:', error);
        res.status(500).json({ error: 'Failed to enqueue lead qualification' });
    }
});

export const intelligenceRoutes = router;
