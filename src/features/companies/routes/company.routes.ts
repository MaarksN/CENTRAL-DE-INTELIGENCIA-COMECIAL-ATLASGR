import { Router, Request, Response, NextFunction } from 'express';
import { companyService } from '../services/company.service.js';
import { validateRequest } from '../../../shared/middlewares/validateRequest.js';
import { companySchema } from '../../../lib/zod.js';
import { enrichCompany } from '../../prospecting/services/enrichment.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const companies = await companyService.findAll(orgId, req.query.q as string | undefined);
        res.json({ success: true, data: companies });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const company = await companyService.findById(orgId, req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, error: 'Company not found' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateRequest(companySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const company = await companyService.create(orgId, req.body);
        res.status(201).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validateRequest(companySchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        const company = await companyService.update(orgId, req.params.id, req.body);
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgId = (req as any).user.organizationId;
        await companyService.delete(orgId, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// Re-enriquece uma empresa já existente no CRM (Receita Federal + heurísticas de domínio/e-mail).
router.post('/:id/enrich', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await enrichCompany(req.params.id, { cnpj: req.body?.cnpj, segmentKeywords: req.body?.segmentKeywords });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

export const companyRoutes = router;
