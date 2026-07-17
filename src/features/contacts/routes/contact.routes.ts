import { Router, Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service.js';
import { validateRequest } from '../../../shared/middlewares/validateRequest.js';
import { contactSchema } from '../../../lib/zod.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const contacts = await contactService.findAll(orgId, req.query.q as string | undefined);
        res.json({ success: true, data: contacts });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const contact = await contactService.findById(orgId, req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateRequest(contactSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const contact = await contactService.create(orgId, req.body);
        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validateRequest(contactSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const contact = await contactService.update(orgId, req.params.id, req.body);
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        await contactService.delete(orgId, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const contactRoutes = router;
