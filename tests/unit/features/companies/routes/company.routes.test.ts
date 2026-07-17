import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { companyRoutes } from '@/features/companies/routes/company.routes';
import { companyService } from '@/features/companies/services/company.service';
import { errorHandler } from '@/shared/middlewares/errorHandler';

vi.mock('@/features/companies/services/company.service', () => ({
    companyService: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}));

const app = express();
app.use(express.json());
app.use('/api/companies', companyRoutes);
app.use(errorHandler);

describe('Company Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET /api/companies should return companies', async () => {
        const mockCompanies = [{ id: '1', legalName: 'Test' }];
        vi.mocked(companyService.findAll).mockResolvedValue(mockCompanies as any);

        const res = await request(app).get('/api/companies');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockCompanies);
    });

    it('GET /api/companies/:id should return a company', async () => {
        const mockCompany = { id: '1', legalName: 'Test' };
        vi.mocked(companyService.findById).mockResolvedValue(mockCompany as any);

        const res = await request(app).get('/api/companies/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockCompany);
    });

    it('GET /api/companies/:id should return 404 if not found', async () => {
        vi.mocked(companyService.findById).mockResolvedValue(null);

        const res = await request(app).get('/api/companies/999');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('POST /api/companies should create a company', async () => {
        const mockCompany = { id: '1', legalName: 'New Corp', tradeName: 'Corp' };
        vi.mocked(companyService.create).mockResolvedValue(mockCompany as any);

        const res = await request(app)
            .post('/api/companies')
            .send({ legalName: 'New Corp', tradeName: 'Corp' });
            
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockCompany);
    });

    it('POST /api/companies should fail validation without legalName', async () => {
        const res = await request(app)
            .post('/api/companies')
            .send({ tradeName: 'Corp' });
            
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Erro de Validação');
    });

    it('PUT /api/companies/:id should update a company', async () => {
        const mockCompany = { id: '1', legalName: 'Updated', tradeName: 'Corp' };
        vi.mocked(companyService.update).mockResolvedValue(mockCompany as any);

        const res = await request(app)
            .put('/api/companies/1')
            .send({ legalName: 'Updated' });
            
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockCompany);
    });

    it('DELETE /api/companies/:id should delete a company', async () => {
        vi.mocked(companyService.delete).mockResolvedValue({ id: '1' } as any);

        const res = await request(app).delete('/api/companies/1');
        expect(res.status).toBe(204);
    });
});
