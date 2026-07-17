import { Router, Request, Response, NextFunction } from 'express';
import { discoverCandidates, promoteToCrm } from '../services/prospecting.service.js';
import { fetchCnpjData } from '../services/enrichment.service.js';

const router = Router();

// Descoberta de candidatos via IA a partir de um ICP (Perfil de Cliente Ideal).
router.post('/discover', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const criteria = req.body;
        if (!criteria || typeof criteria !== 'object') {
            return res.status(400).json({ success: false, error: 'Critérios de busca inválidos' });
        }
        const result = await discoverCandidates(criteria);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Consulta em tempo real (sem persistir) de um CNPJ na Receita Federal via BrasilAPI.
router.post('/enrich-cnpj', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cnpj } = req.body;
        if (!cnpj || typeof cnpj !== 'string') {
            return res.status(400).json({ success: false, error: 'CNPJ é obrigatório' });
        }
        const result = await fetchCnpjData(cnpj);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Promove um candidato (IA ou CNPJ) para o CRM: cria Company + Contact + Lead e enriquece automaticamente.
router.post('/promote', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tradeName, source } = req.body;
        if (!tradeName || !source) {
            return res.status(400).json({ success: false, error: 'tradeName e source são obrigatórios' });
        }
        const result = await promoteToCrm(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

export const prospectingRoutes = router;
