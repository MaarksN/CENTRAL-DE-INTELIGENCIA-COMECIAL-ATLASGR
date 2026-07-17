import { Router, Request, Response, NextFunction } from 'express';
import { activityService } from '../services/activity.service.js';
import { validateRequest } from '../../../shared/middlewares/validateRequest.js';
import { activitySchema } from '../../../lib/zod.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await activityService.findAll(req.query.date as string | undefined);
        res.json({ success: true, data: activities });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateRequest(activitySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await activityService.create(req.body);
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validateRequest(activitySchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await activityService.update(req.params.id, req.body);
        res.json({ success: true, data: activity });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await activityService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const activityRoutes = router;
