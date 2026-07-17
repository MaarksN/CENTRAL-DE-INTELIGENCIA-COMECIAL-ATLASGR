import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';

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

export const intelligenceRoutes = router;
