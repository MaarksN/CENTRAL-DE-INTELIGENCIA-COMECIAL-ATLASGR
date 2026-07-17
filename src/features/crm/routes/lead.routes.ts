import { Router, Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service.js';
import { validateRequest } from '../../../shared/middlewares/validateRequest.js';
import { leadSchema } from '../../../lib/zod.js';
import type { AuthRequest } from '../../../shared/middlewares/authenticateToken.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId: orgId } = (req as AuthRequest).user;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const result = await leadService.findAll(orgId, req.query.status as string | undefined, page, limit);
        res.json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId: orgId } = (req as AuthRequest).user;
        const lead = await leadService.findById(orgId, req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateRequest(leadSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId: orgId } = (req as AuthRequest).user;
        const lead = await leadService.create(orgId, req.body);
        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validateRequest(leadSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId: orgId } = (req as AuthRequest).user;
        const leadId = req.params.id;
        let lead;
        if (req.body.status && Object.keys(req.body).length === 1) {
            lead = await leadService.updateStatus(orgId, leadId, req.body.status);
        } else {
            lead = await leadService.update(orgId, leadId, req.body);
        }
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId: orgId } = (req as AuthRequest).user;
        await leadService.delete(orgId, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const leadRoutes = router;
